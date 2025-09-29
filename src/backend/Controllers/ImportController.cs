
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parking.Api.Data;
using Parking.Api.Dtos;
using Parking.Api.Models;
using Parking.Api.Services;
using Parking.Api.Services.CSVService;
using System.Globalization;
using System.IO.Pipes;
using System.Text;


namespace Parking.Api.Controllers
{
    [ApiController]
    [Route("api/import")]
    public class ImportController : ControllerBase
    {
        private readonly CSVService _csvService;
        public ImportController(CSVService csvService) { _csvService = csvService; }

        [HttpPost("csv")]
        public async Task<IActionResult> ImportCsv()
        {
            if (!Request.HasFormContentType || Request.Form.Files.Count == 0)
                return BadRequest("Envie um arquivo CSV no campo 'file'.");

            var resultado = await _csvService.Import(Request.Form.Files[0]);

            return Ok(resultado);
        }
    }
}
