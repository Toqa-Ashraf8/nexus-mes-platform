using Microsoft.AspNetCore.Mvc;
using MesApp.Services;

namespace MesApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductSyncController : ControllerBase
    {
        private readonly ISapSyncService _sapService;
        private readonly IProcessDefinitionRepository _repo;
        public ProductSyncController(ISapSyncService sapService, IProcessDefinitionRepository repo)
        {
            _sapService = sapService;
            _repo = repo;
        }

        [HttpGet("products")]
        public async Task< IActionResult> GetSapProducts()
        {
            try
            {
                var allProducts =await _repo.GetAllProducts();
                return Ok(allProducts); 
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