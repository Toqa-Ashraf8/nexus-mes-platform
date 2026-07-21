using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace mes_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessDefinitionController : ControllerBase
    {
        private readonly IProcessDefinitionRepository repo;
        public ProcessDefinitionController(IProcessDefinitionRepository repository)
        {
            repo = repository;
        }
        [Route("ReleaseDefinition")]
        [HttpPost]
        public async Task<IActionResult> ReleaseDefinition([FromBody] ProductMaster product)
        {
            if(product==null) return BadRequest(new { message = "No product provided"});
            var isRelesaed = await repo.ReleaseDefinition(product);
            return Ok(new { isRelesaed = isRelesaed ,message= "Product Definition approved & ready for Work Order creation!" });
            
        }
    }
}
