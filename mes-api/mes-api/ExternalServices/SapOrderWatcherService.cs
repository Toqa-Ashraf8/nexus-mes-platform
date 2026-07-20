using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class SapOrderWatcherService : BackgroundService
{
    private readonly ILogger<SapOrderWatcherService> _logger;
    private FileSystemWatcher _watcher;


    private readonly string _watchPath = @"G:\FACTORY\nexus-mes-platform\SAP_Outbound_Dropzone";

    public SapOrderWatcherService(ILogger<SapOrderWatcherService> logger)
    {
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!Directory.Exists(_watchPath))
        {
            Directory.CreateDirectory(_watchPath);
        }

        _watcher = new FileSystemWatcher(_watchPath)
        {
            Filter = "*.xml", 
            EnableRaisingEvents = true
        };

        _watcher.Created += OnFileCreated;

        _logger.LogInformation($"SAP Watcher Service started. Monitoring folder: {_watchPath}");

        return Task.CompletedTask;
    }

    private void OnFileCreated(object sender, FileSystemEventArgs e)
    {
        _logger.LogInformation($"New SAP File detected: {e.Name}");

        try
        {

            Thread.Sleep(1000);

            XmlDocument doc = new XmlDocument();
            doc.Load(e.FullPath);


            string orderId = doc.SelectSingleNode("//OrderId")?.InnerText;
            string productSku = doc.SelectSingleNode("//ProductSKU")?.InnerText;
            string productName = doc.SelectSingleNode("//ProductName")?.InnerText;
            string targetQuantity = doc.SelectSingleNode("//TargetQuantity")?.InnerText;

            _logger.LogInformation($"Successfully Parsed SAP Order: {orderId} for Product: {productName}");


            XmlNodeList bomItems = doc.SelectNodes("//BillOfMaterials/Item");
            foreach (XmlNode item in bomItems)
            {
                string matId = item.SelectSingleNode("MaterialId")?.InnerText;
                string matName = item.SelectSingleNode("MaterialName")?.InnerText;
                string qty = item.SelectSingleNode("QtyPerUnit")?.InnerText;


                _logger.LogInformation($"Found BOM Item: {matName} (ID: {matId}) - Qty: {qty}");
            }
            File.Delete(e.FullPath);
            _logger.LogInformation($"File {e.Name} processed and cleaned from dropzone.");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing SAP XML file: {ex.Message}");
        }
    }

    public override void Dispose()
    {
        _watcher?.Dispose();
        base.Dispose();
    }
}