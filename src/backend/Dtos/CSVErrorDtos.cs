namespace Parking.Api.Dtos;

public record CSVErrorDto(int processados, int inseridos, List<CSVErrorExplain> error);
public record CSVErrorExplain(
    int linha,
    string tipoErro,
    string placa,
    string modelo,
    int? ano,
    int? clienteId,
    string clienteNome,
    string clienteTelefone,
    string clienteEndereco,
    bool? mensalista,
    decimal? valorMensalidade
);

public class TipoErro
{
    public const string PlacaInvalida = "Placa inválida";
    public const string PlacaDuplicada = "Placa duplicada";

}

