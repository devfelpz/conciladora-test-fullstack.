
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parking.Api.Data;
using Parking.Api.Dtos;
using Parking.Api.Models;
using Parking.Api.Services;
using System.Globalization;
using System.IO.Pipes;
using System.Text;


namespace Parking.Api.Controllers
{
    [ApiController]
    [Route("api/import")]
    public class ImportController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly PlacaService _placa;
        public ImportController(AppDbContext db, PlacaService placa) { _db = db; _placa = placa; }

        [HttpPost("csv")]
        public async Task<IActionResult> ImportCsv()
        {
            if (!Request.HasFormContentType || Request.Form.Files.Count == 0)
                return BadRequest("Envie um arquivo CSV no campo 'file'.");

            var file = Request.Form.Files[0];
            using var s = file.OpenReadStream();
            using var r = new StreamReader(s, Encoding.UTF8);

            int linha = 0, processados = 0, inseridos = 0;
            var erros = new List<CSVErrorExplain>();
            string? header = await r.ReadLineAsync(); // consome cabeçalho
            while (!r.EndOfStream)
            {
                linha++;
                var raw = await r.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(raw)) continue;
                processados++;

                string placa = null;
                string modelo = null;
                int? ano = null;
                string cliId = null;
                string cliNome = null;
                string cliTel = null;
                string cliEnd = null;
                bool mensalista = false;
                decimal? valorMensalidade = null;

                // CSV simples separado por vírgula: placa,modelo,ano,cliente_identificador,cliente_nome,cliente_telefone,cliente_endereco,mensalista,valor_mensalidade
                var cols = raw.Split(',');
                try
                {
                    placa = _placa.Sanitizar(cols[0]);
                    modelo = cols[1];
                    ano = int.TryParse(cols[2], out var _ano) ? _ano : null;
                    cliId = cols[3];
                    cliNome = cols[4];
                    cliTel = new string((cols[5] ?? "").Where(char.IsDigit).ToArray());
                    cliEnd = cols[6];
                    if (cols.Length > 7)
                        mensalista = cols[7].Trim().ToLower() switch
                        {
                            "true" => true,
                            "sim" => true,
                            "false" => false,
                            "não" => false,
                            _ => false
                        };

                    if (cols.Length > 8)
                    {
                        var valorStr = cols[8].Trim().Trim('"');
                        if (decimal.TryParse(valorStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var vm))
                            valorMensalidade = vm;
                    }

                    if (!_placa.EhValida(placa)) throw new Exception(TipoErro.PlacaInvalida);
                    if (await _db.Veiculos.AnyAsync(v => v.Placa == placa)) throw new Exception(TipoErro.PlacaDuplicada);

                    var cliente = await _db.Clientes.FirstOrDefaultAsync(c => c.Nome == cliNome && c.Telefone == cliTel);
                    if (cliente == null)
                    {
                        cliente = new Cliente { Nome = cliNome, Telefone = cliTel, Endereco = cliEnd, Mensalista = mensalista, ValorMensalidade = valorMensalidade };
                        _db.Clientes.Add(cliente);
                        await _db.SaveChangesAsync();
                    }

                    var v = new Veiculo { Placa = placa, Modelo = modelo, Ano = ano, ClienteId = cliente.Id };
                    _db.Veiculos.Add(v);
                    await _db.SaveChangesAsync();
                    inseridos++;
                }
                catch (Exception ex)
                {
                    erros.Add(new CSVErrorExplain(
                        linha,
                        ex.Message,
                        placa,
                        modelo,
                        ano,
                        cliId != null && int.TryParse(cliId, out var cId) ? cId : null,
                        cliNome,
                        cliTel,
                        cliEnd,
                        mensalista,
                        valorMensalidade
                    ));
                }
            }

            var resultado = new CSVErrorDto(processados, inseridos, erros);
            return Ok(resultado);
        }
    }
}
