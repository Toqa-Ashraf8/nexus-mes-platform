using System;
using System.IO;
using System.Linq;
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

            if (string.Equals(rootName, "EquipmentDefinition", StringComparison.OrdinalIgnoreCase) ||
                xDoc.Descendants().Any(e => string.Equals(e.Name.LocalName, "Equipment", StringComparison.OrdinalIgnoreCase)))
            {
                await ProcessWorkCentersXml(xDoc);
            }
            else if (string.Equals(rootName, "ProductionOrders", StringComparison.OrdinalIgnoreCase) ||
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

        private async Task ProcessWorkCentersXml(XDocument xDoc)
        {
            var equipmentElements = xDoc.Descendants()
                                        .Where(e => string.Equals(e.Name.LocalName, "Equipment", StringComparison.OrdinalIgnoreCase))
                                        .ToList();

            if (!equipmentElements.Any())
            {
                _logger.LogWarning("No <Equipment> tags found in the XML file");
                return;
            }

            foreach (var eq in equipmentElements)
            {
                var externalName = GetElementValue(eq, "WorkCenterName"); 
                if (string.IsNullOrEmpty(externalName)) continue;

                var department = eq.Elements()
                                  .Where(e => string.Equals(e.Name.LocalName, "EquipmentProperty", StringComparison.OrdinalIgnoreCase))
                                  .FirstOrDefault(p => GetElementValue(p, "ID") == "Department")
                                  ?.Elements()
                                  .FirstOrDefault(v => string.Equals(v.Name.LocalName, "Value", StringComparison.OrdinalIgnoreCase))?.Value ?? "General";

                var existingCenter = await _context.WorkCenters.FirstOrDefaultAsync(w => w.WorkCenterName == externalName);

                if (existingCenter == null)
                {
                    var newCenter = new WorkCenter
                    {
                        WorkCenterName = externalName,
                        Description = GetElementValue(eq, "Description"),
                        EquipmentClassName = GetElementValue(eq, "EquipmentClassName"),
                        Department = department,
                        IsActive = true,
                        LastSyncDate = DateTime.Now
                    };

                    await _context.WorkCenters.AddAsync(newCenter);
                    _logger.LogInformation("[SAP Sync] Added NEW WorkCenter: {Code}", externalName);
                }
                else
                {
                    existingCenter.Description = GetElementValue(eq, "Description");
                    existingCenter.EquipmentClassName = GetElementValue(eq, "EquipmentClassName");
                    existingCenter.Department = department;
                    existingCenter.LastSyncDate = DateTime.Now;
                    existingCenter.IsActive = true;

                    _logger.LogInformation("[SAP Sync] Updated WorkCenter: {Code}", externalName);
                }
            }

            var rowsSaved = await _context.SaveChangesAsync();
            _logger.LogInformation("[SAP Sync] Successfully saved/updated WorkCenters. Saved rows: {Count}", rowsSaved);
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

            var existingWorkCenters = await _context.WorkCenters.ToListAsync();

            var incomingWoNumbers = orderElements
                .Select(x => GetElementValue(x, "WorkOrderNumber"))
                .Where(num => !string.IsNullOrEmpty(num))
                .ToList();

            var existingOrdersDict = await _context.WorkOrders
                .Where(w => incomingWoNumbers.Contains(w.WorkOrderNumber))
                .ToDictionaryAsync(w => w.WorkOrderNumber);

            foreach (var x in orderElements)
            {
                var workOrderNum = GetElementValue(x, "WorkOrderNumber");
                if (string.IsNullOrEmpty(workOrderNum)) continue;

                var externalLineCode = GetElementValue(x, "WorkCenterName");
                if (string.IsNullOrEmpty(externalLineCode))
                {
                    externalLineCode = GetElementValue(x, "WorkCenterId");
                }

                var targetWorkCenter = existingWorkCenters.FirstOrDefault(wc =>
                    string.Equals(wc.WorkCenterName, externalLineCode, StringComparison.OrdinalIgnoreCase));

                bool xmlHasException = bool.TryParse(GetElementValue(x, "HasException"), out var parsedEx) && parsedEx;
                string xmlExceptionMsg = GetElementValue(x, "ExceptionMessage");

                bool lineNotFound = targetWorkCenter == null;
                bool effectiveHasException = lineNotFound || xmlHasException;
                string effectiveExceptionMsg = lineNotFound
                    ? $"WorkCenter Code '{externalLineCode}' is not defined in MES."
                    : xmlExceptionMsg;

                if (!existingOrdersDict.TryGetValue(workOrderNum, out var existingOrder))
                {
                    var newOrder = new WorkOrder
                    {
                        WorkOrderNumber = workOrderNum,
                        SKU = GetElementValue(x, "SKU"),
                        TargetQuantity = int.TryParse(GetElementValue(x, "TargetQuantity"), out var tQty) ? tQty : 0,
                        CompletedQuantity = int.TryParse(GetElementValue(x, "CompletedQuantity"), out var cQty) ? cQty : 0,

                        WorkCenterName = externalLineCode,
                        WorkCenterId = targetWorkCenter?.WorkCenterId,

                        Priority = GetElementValue(x, "Priority"),
                        Status = string.IsNullOrEmpty(GetElementValue(x, "Status")) ? "New" : GetElementValue(x, "Status"),
                        PlannedStartTime = DateTime.TryParse(GetElementValue(x, "PlannedStartTime"), out var pStart) ? pStart : DateTime.UtcNow,
                        PlannedEndTime = DateTime.TryParse(GetElementValue(x, "PlannedEndTime"), out var pEnd) ? pEnd : DateTime.UtcNow,
                        HasException = effectiveHasException,
                        ExceptionMessage = effectiveExceptionMsg
                    };

                    await _context.WorkOrders.AddAsync(newOrder);
                    _logger.LogInformation("[SAP Integration] Added WorkOrder {WONumber} -> Name: '{WCName}', WorkCenterId: {WCId}",
                        workOrderNum, externalLineCode, targetWorkCenter?.WorkCenterId);
                }
                else
                {
                    existingOrder.SKU = GetElementValue(x, "SKU");
                    existingOrder.TargetQuantity = int.TryParse(GetElementValue(x, "TargetQuantity"), out var tQty) ? tQty : existingOrder.TargetQuantity;
                    existingOrder.CompletedQuantity = int.TryParse(GetElementValue(x, "CompletedQuantity"), out var cQty) ? cQty : existingOrder.CompletedQuantity;

                    if (!string.IsNullOrEmpty(externalLineCode))
                    {
                        existingOrder.WorkCenterName = externalLineCode;
                    }

                    if (targetWorkCenter != null)
                    {
                        existingOrder.WorkCenterId = targetWorkCenter.WorkCenterId;
                    }

                    existingOrder.Priority = GetElementValue(x, "Priority");

                    if (!string.IsNullOrEmpty(GetElementValue(x, "Status")))
                    {
                        existingOrder.Status = GetElementValue(x, "Status");
                    }

                    existingOrder.HasException = effectiveHasException;
                    existingOrder.ExceptionMessage = effectiveExceptionMsg;

                    _logger.LogInformation("[SAP Integration] Updated WorkOrder {WONumber} -> Name: '{WCName}', WorkCenterId: {WCId}",
                        workOrderNum, existingOrder.WorkCenterName, existingOrder.WorkCenterId);
                }
            }

            var rowsSaved = await _context.SaveChangesAsync();
            _logger.LogInformation("[SAP Integration] Successfully saved {Count} records to WorkOrders.", rowsSaved);
        }

        private string GetElementValue(XElement parentElement, string localName)
        {
            return parentElement.Elements()
                                .FirstOrDefault(e => string.Equals(e.Name.LocalName, localName, StringComparison.OrdinalIgnoreCase))
                                ?.Value ?? string.Empty;
        }
    }
}