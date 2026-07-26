using System.IO;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


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

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _logger.LogInformation("[SAP Integration] Monitoring started at: {Path}", _watchFolderPath);

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

        return Task.CompletedTask;
    }

    private async void OnNewXmlFileCreated(object sender, FileSystemEventArgs e)
    {
        _logger.LogInformation("[SAP Integration] New XML Detected: {FileName}", e.Name);

        await Task.Delay(1000);

        try
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var xmlProcessor = scope.ServiceProvider.GetRequiredService<ISapXmlProcessorService>();

                await xmlProcessor.ProcessAndRouteXml(e.FullPath);
            }
            var destinationPath = Path.Combine(_processedFolderPath, $"{Path.GetFileNameWithoutExtension(e.Name)}_{DateTime.Now:yyyyMMdd_HHmmss}.xml");

            if (File.Exists(e.FullPath))
            {
                File.Move(e.FullPath, destinationPath);
                _logger.LogInformation("[SAP Integration] File processed and moved to SAP_Processed.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing SAP XML: {FileName}", e.Name);
        }
    }

    public override void Dispose()
    {
        _watcher?.Dispose();
        base.Dispose();
    }
}