using Microsoft.EntityFrameworkCore;

public class WorkOrderService : IWorkOrderService
{
    private readonly DataContext _context;

    public WorkOrderService(DataContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<WorkOrderListDto>> GetReleasedWorkOrdersAsync(WorkOrderParametersDTO queryParams)
    {

        var query = from wo in _context.WorkOrders.AsNoTracking()
                    join pm in _context.ProductMasters.AsNoTracking() on wo.SKU equals pm.SKU
                    join wc in _context.WorkCenters.AsNoTracking() on wo.WorkCenterId equals wc.WorkCenterId 
                    where pm.DefinitionStatus == "Released"
                       && (wo.Status == "Unreleased" || wo.Status == "On Hold")
                    select new WorkOrderListDto
                    {
                        WorkOrderNumber=wo.WorkOrderNumber,
                        WorkOrderID = wo.Id,
                        SKU = wo.SKU,
                        TargetQuantity = wo.TargetQuantity,
                        CompletedQuantity=wo.CompletedQuantity,
                        Priority = wo.Priority,
                        WorkCenterName = wc != null ? wc.WorkCenterName : "Not Assigned",
                        PlannedStartTime = wo.PlannedStartTime,
                        PlannedEndTime=wo.PlannedEndTime,
                        Status = wo.Status,
                        HasException=wo.HasException,
                        ExceptionMessage=wo.ExceptionMessage,
                        ProductDefinitionStatus = pm.DefinitionStatus
                    };

        int totalCount = await query.CountAsync();

        var items = await query
            .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .ToListAsync();

        return new PagedResult<WorkOrderListDto>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };
    }
}