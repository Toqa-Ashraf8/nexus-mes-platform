using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace mes_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DispatchController : ControllerBase
    {
        private readonly IWorkOrderService _workOrderService;
        public DispatchController(IWorkOrderService service)
        {
            _workOrderService = service;
        }
        [Route("GetWorkOrdersList")]
        [HttpGet]
        public async Task<IActionResult> GetWorkOrdersList([FromQuery] WorkOrderParametersDTO queryParams)
        {
            var result = await _workOrderService.GetReleasedWorkOrdersAsync(queryParams);
            return Ok(result);
        }
    }
}
