
using System.Text.RegularExpressions;

namespace Parking.Api.Services
{
    public class PlacaService
    {
        // Intencionalmente simples (candidato deve robustecer)
        public string Sanitizar(string? placa)
        {
            if (String.IsNullOrWhiteSpace(placa))
                return string.Empty;
            var p = Regex.Replace(placa ?? "", "[^A-Za-z0-9]", "").ToUpperInvariant();
            return p;
        }

        // TODO: melhorar regras para Mercosul - aceitar AAA1A23 e similares
        public bool EhValida(string placa)
        {

            var padraoAntigo = new Regex(@"^[A-Z]{3}[0-9]{4}$", RegexOptions.Compiled);
            var padraoMercosul = new Regex(@"^[A-Z]{3}[0-9][A-Z][0-9]{2}$", RegexOptions.Compiled);

            return padraoAntigo.IsMatch(placa) || padraoMercosul.IsMatch(placa);
        }
    }
}
