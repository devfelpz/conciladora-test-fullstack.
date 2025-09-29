using Parking.Api.Dtos;

namespace Parking.Api.Services.CSVService;

public interface ICSVService
{
    public Task<CSVResponseDto> Import(IFormFile csv);
}


