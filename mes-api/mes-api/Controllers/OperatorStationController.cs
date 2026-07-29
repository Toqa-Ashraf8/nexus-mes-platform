using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mes_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperatorStationController : ControllerBase
    {
        private readonly DataContext _context;
        public OperatorStationController(DataContext context)
        {
            _context = context;
        }
        [Route("VerifyRfid")]
        [HttpGet]
        public async Task<IActionResult> VerifyRfid([FromQuery] string rfidTag)
        {
            if (string.IsNullOrWhiteSpace(rfidTag))
                return BadRequest(new { Message = "RFID Tag is required" });

            var operatorUser = await _context.PersonnelMasters
                .FirstOrDefaultAsync(p => p.RfidTag == rfidTag && p.IsActive);

            if (operatorUser == null)
            {
                return NotFound(new { Message = "Invalid Card! Operator not found or inactive." });
            }

            return Ok(new
            {
                EmployeeId = operatorUser.EmployeeId,
                Name = operatorUser.Name,
                PersonnelClass = operatorUser.PersonnelClassName,
                Qualification = operatorUser.Qualification,
                RfidTag = operatorUser.RfidTag
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkCenterById(int id)
        {
            var workCenter = await _context.WorkCenters
                .Where(w => w.WorkCenterId == id && w.IsActive)
                .Select(w => new {
                    w.WorkCenterId,
                    w.WorkCenterName,
                    w.Department
                })
                .FirstOrDefaultAsync();

            if (workCenter == null) return NotFound(new { Message = "Work Center Not Found" });

            return Ok(workCenter);
        }
    }
}
