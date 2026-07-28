using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class SapFolderMonitorService : BackgroundService
{
    private readonly ILogger<SapFolderMonitorService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly string _watchFolderPath;
    private readonly string _processedFolderPath;
    private FileSystemWatcher? _watcher;

    public SapFolderMonitorService(
        ILogger<SapFolderMonitorService> logger,
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;

        var configuredWatchPath = configuration["SapIntegrationSettings:WatchFolderPath"];

        _watchFolderPath = !string.IsNullOrWhiteSpace(configuredWatchPath)
            ? configuredWatchPath
            : Path.Combine(Directory.GetCurrentDirectory(), "SAP_Drop_Box");

        _processedFolderPath = !string.IsNullOrWhiteSpace(configuration["SapIntegrationSettings:ProcessedFolderPath"])
            ? configuration["SapIntegrationSettings:ProcessedFolderPath"]
            : Path.Combine(Directory.GetCurrentDirectory(), "SAP_Processed");

        Directory.CreateDirectory(_watchFolderPath);
        Directory.CreateDirectory(_processedFolderPath);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _logger.LogInformation("[SAP Integration] Monitoring started at: {Path}", _watchFolderPath);
            await ProcessExistingFilesAsync();

            _watcher = new FileSystemWatcher(_watchFolderPath, "*.xml")
            {
                NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.CreationTime,
                EnableRaisingEvents = true
            };

            _watcher.Created += OnNewXmlFileCreated;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start FileSystemWatcher at path: {Path}", _watchFolderPath);
        }
    }

    private async void OnNewXmlFileCreated(object sender, FileSystemEventArgs e)
    {
        _logger.LogInformation("[SAP Integration] New XML Detected: {FileName}", e.Name);
        await ProcessSingleFile(e.FullPath);
    }

    private async Task ProcessExistingFilesAsync()
    {
        var existingFiles = Directory.GetFiles(_watchFolderPath, "*.xml");

        if (existingFiles.Length > 0)
        {
            _logger.LogInformation("[SAP Integration] Found {Count} existing file(s) in Drop Box. Processing...", existingFiles.Length);

            foreach (var filePath in existingFiles)
            {
                await ProcessSingleFile(filePath);
            }
        }
    }

    private async Task ProcessSingleFile(string filePath)
    {
        var fileName = Path.GetFileName(filePath);
        await Task.Delay(1000);

        try
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var xmlProcessor = scope.ServiceProvider.GetRequiredService<ISapXmlProcessorService>();
                await xmlProcessor.ProcessAndRouteXml(filePath);
            }

            var destinationPath = Path.Combine(_processedFolderPath, $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.Now:yyyyMMdd_HHmmss}.xml");

            if (File.Exists(filePath))
            {
                File.Move(filePath, destinationPath);
                _logger.LogInformation("[SAP Integration] File processed and moved to SAP_Processed: {FileName}", fileName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing SAP XML: {FileName}", fileName);
        }
    }

    public override void Dispose()
    {
        _watcher?.Dispose();
        base.Dispose();
    }
}