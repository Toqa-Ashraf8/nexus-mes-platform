using Microsoft.AspNetCore.Mvc;
using MesApp.Services;

namespace MesApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductSyncController : ControllerBase
    {
        private readonly ISapSyncService _sapService;

        // حقن السيرفس عبر الـ Constructor
        public ProductSyncController(ISapSyncService sapService)
        {
            _sapService = sapService;
        }

        [HttpGet("products")]
        public IActionResult GetSapProducts()
        {
            try
            {
                var products = _sapService.ParseSapXmlData();
                return Ok(products);
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error reading or parsing SAP XML", error = ex.Message });
            }
        }
    }
}