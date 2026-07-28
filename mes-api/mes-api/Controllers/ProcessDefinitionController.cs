using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace mes_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessDefinitionController : ControllerBase
    {
        private readonly IProcessDefinitionRepository repo;
        private readonly IFileService _fileService;
        private readonly ISapSyncService _sapService;
        public ProcessDefinitionController(IProcessDefinitionRepository repository, IFileService fileService, ISapSyncService sapService)
        {
            repo = repository;
            _fileService = fileService;
            _sapService = sapService;
        }
        [Route("ImportSAPXml")]
        [HttpPost]
        public async Task<IActionResult> ImportSapXml()
        {
            var products =await _sapService.SaveSapProductsToDb();
            return Ok(new { products = products, message = "Data imported successfully!" });
        }


        [Route("ReleaseDefinition")]
        [HttpPost]
        public async Task<IActionResult> ReleaseDefinition([FromBody] ProductMaster product)
        {
            if(product==null) return BadRequest(new { message = "No product provided"});
            var isRelesaed = await repo.ReleaseDefinition(product);
            return Ok(new { isRelesaed = isRelesaed ,message= "Product Definition approved & ready for Work Order creation!" });
            
        }
        [Route("UpdloadImages")]
        [HttpPost]
        public async Task <IActionResult> UpdloadImages(IFormFile file, string Folder)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Only images (.jpg, .jpeg, .png) or PDFs are allowed." });

            var filename = await _fileService.UploadImages(file, Folder);
            return Ok(filename) ;
        }
       
        [Route("UploadVideos")]
        [HttpPost]
        [RequestSizeLimit(100 * 1024 * 1024)]
        public async Task<IActionResult> UploadVideos(IFormFile file, [FromQuery] string Folder)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var allowedExtensions = new[] { ".mp4", ".mov", ".avi", ".mkv", ".webm", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Only allowed extensions are (.mp4, .mov, .avi, .mkv, .webm, .gif)" });

            var allowedMimeTypes = new[] { "video/mp4", "video/quicktime", "video/x-msvideo", "image/gif" };
            if (!allowedMimeTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { message = "Invalid file type / Content-Type." });

            var filename = await _fileService.UploadVideos(file, Folder);
            return Ok( filename);
        }
    }
}
