using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FactoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkOrdersController : ControllerBase
    {
        private readonly DataContext _context;

        public WorkOrdersController(DataContext context)
        {
            _context = context;
        }

      
        [HttpGet("station")]
        public async Task<IActionResult> GetWorkOrdersForStation()
        {
            var workOrders = await _context.WorkOrders
                .Select(w => new
                {
                    id = w.Id,
                    WorkOrderNumber = w.WorkOrderNumber,
                    SKU = w.SKU, 
                    status = w.Status,
                    targetQuantity = w.TargetQuantity
                })
                .ToListAsync();

            return Ok(workOrders);
        }

     
    }
}