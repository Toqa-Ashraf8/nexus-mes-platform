
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

        string originalFileName = Path.GetFileName(file.FileName);
        string extension = Path.GetExtension(originalFileName);
        string uniqueVideoName = $"{Guid.NewGuid()}_{DateTime.UtcNow.Ticks}{extension}";

        var targetDirectory = Path.Combine(_env.ContentRootPath, "Videos", folderName ?? "Default");

        if (!Directory.Exists(targetDirectory))
        {
            Directory.CreateDirectory(targetDirectory);
        }

        var physicalPath = Path.Combine(targetDirectory, uniqueVideoName);

        using (var stream = new FileStream(physicalPath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            await file.CopyToAsync(stream);
        }

        return uniqueVideoName;
    }

}



