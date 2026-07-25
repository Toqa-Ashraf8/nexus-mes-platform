
    public class FileService : IFileService
    {
         private readonly IWebHostEnvironment _env;
        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }
    public async Task<string> UploadImages(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null.");

        string fileName = file.FileName;

        var targetDirectory = Path.Combine(_env.ContentRootPath, "Images", folderName);

        if (!Directory.Exists(targetDirectory))
        {
            Directory.CreateDirectory(targetDirectory);
        }

        var physicalPath = Path.Combine(targetDirectory, fileName);

        using (var stream = new FileStream(physicalPath, FileMode.Create, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }

        return fileName;
    }
    public async Task<string> UploadVideos(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null.");

        string videoName = file.FileName;

        var targetDirectory = Path.Combine(_env.ContentRootPath, "Videos", folderName);

        if (!Directory.Exists(targetDirectory))
        {
            Directory.CreateDirectory(targetDirectory);
        }

        var physicalPath = Path.Combine(targetDirectory, videoName);

        using (var stream = new FileStream(physicalPath, FileMode.Create, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }

        return videoName;

    }
    //public async Task<string> UploadMediaFile(IFormFile file, string mediaTypeFolder, string subFolder)
    //{
    //    if (file == null || file.Length == 0)
    //        throw new ArgumentException("File is empty or null.");

    //    string fileExtension = Path.GetExtension(file.FileName);
    //    string uniqueFileName = $"{Guid.NewGuid()}_{DateTime.UtcNow.Ticks}{fileExtension}";

    
    //    string rootPath = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");

    //    var targetDirectory = Path.Combine(rootPath, mediaTypeFolder, subFolder);

    //    if (!Directory.Exists(targetDirectory))
    //    {
    //        Directory.CreateDirectory(targetDirectory);
    //    }

    //    var physicalPath = Path.Combine(targetDirectory, uniqueFileName);

    //    using (var stream = new FileStream(physicalPath, FileMode.Create, FileAccess.Write))
    //    {
    //        await file.CopyToAsync(stream);
    //    }

    //    return uniqueFileName;
    //}

}

