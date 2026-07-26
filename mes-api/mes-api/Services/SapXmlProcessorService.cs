using System;
using System.IO;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace NexusMesPlatform.Services
{
    public class SapXmlProcessorService : ISapXmlProcessorService
    {
        private readonly DataContext _context;
        private readonly ILogger<SapXmlProcessorService> _logger;

        public SapXmlProcessorService(DataContext context, ILogger<SapXmlProcessorService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task ProcessAndRouteXml(string filePath)
        {
            var xDoc = XDocument.Load(filePath);
            var rootName = xDoc.Root?.Name.LocalName?.Trim();

            _logger.LogInformation("Processing XML File: {Path} | Root Element: '{Root}'", Path.GetFileName(filePath), rootName);

            if (string.Equals(rootName, "ProductionOrders", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(rootName, "WorkOrders", StringComparison.OrdinalIgnoreCase) ||
                xDoc.Descendants().Any(e => string.Equals(e.Name.LocalName, "WorkOrder", StringComparison.OrdinalIgnoreCase)))
            {
                await ProcessWorkOrdersXml(xDoc);
            }
            else
            {
                _logger.LogWarning("Could not route XML file. Unknown Root Element: '{Root}'", rootName);
            }
        }

        private async Task ProcessWorkOrdersXml(XDocument xDoc)
        {
            var orderElements = xDoc.Descendants()
                                    .Where(e => string.Equals(e.Name.LocalName, "WorkOrder", StringComparison.OrdinalIgnoreCase))
                                    .ToList();

            if (!orderElements.Any())
            {
                _logger.LogWarning("No <WorkOrder> tags found in the XML file");
                return;
            }

            foreach (var x in orderElements)
            {
                var workOrderNum = GetElementValue(x, "WorkOrderNumber");
                if (string.IsNullOrEmpty(workOrderNum)) continue;
                var existingOrder = await _context.WorkOrders.FirstOrDefaultAsync(w => w.WorkOrderNumber == workOrderNum);

                if (existingOrder == null)
                {
                    var newOrder = new WorkOrder
                    {
                        WorkOrderNumber = workOrderNum,
                        SKU = GetElementValue(x, "SKU"),
                        TargetQuantity = int.TryParse(GetElementValue(x, "TargetQuantity"), out var tQty) ? tQty : 0,
                        CompletedQuantity = int.TryParse(GetElementValue(x, "CompletedQuantity"), out var cQty) ? cQty : 0,
                        WorkCenterId = GetElementValue(x, "WorkCenterId"),
                        Priority = string.IsNullOrEmpty(GetElementValue(x, "Priority")) ? "Medium" : GetElementValue(x, "Priority"),
                        Status = "New", 
                        PlannedStartTime = DateTime.TryParse(GetElementValue(x, "PlannedStartTime"), out var pStart) ? pStart : DateTime.Now,
                        PlannedEndTime = DateTime.TryParse(GetElementValue(x, "PlannedEndTime"), out var pEnd) ? pEnd : DateTime.Now,
                        HasException = bool.TryParse(GetElementValue(x, "HasException"), out var hasEx) && hasEx,
                        ExceptionMessage = GetElementValue(x, "ExceptionMessage")
                    };

                    await _context.WorkOrders.AddAsync(newOrder);
                    _logger.LogInformation("[SAP] Loaded new WorkOrder into Context: {WONumber}", workOrderNum);
                }
                else
                {
                    _logger.LogInformation("[SAP] WorkOrder {WONumber} already exists. Skipping.", workOrderNum);
                }
            }

            var rowsSaved = await _context.SaveChangesAsync();
            _logger.LogInformation("[SAP] Saved {Count} new record(s) to Database successfully.", rowsSaved);
        }

        private string GetElementValue(XElement parentElement, string localName)
        {
            return parentElement.Elements()
                                .FirstOrDefault(e => string.Equals(e.Name.LocalName, localName, StringComparison.OrdinalIgnoreCase))
                                ?.Value ?? string.Empty;
        }
    }
}