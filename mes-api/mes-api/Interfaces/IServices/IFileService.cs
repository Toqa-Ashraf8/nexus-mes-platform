
    public interface IFileService
    {
    Task<string> UploadVideos(IFormFile file, string folderName);
    Task<string> UploadImages(IFormFile file, string folderName);
    }

