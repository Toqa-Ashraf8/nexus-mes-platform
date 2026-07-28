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
                    where pm.DefinitionStatus == "Released"
                       && (wo.Status == "Unreleased" || wo.Status == "On Hold")
                    select new WorkOrderListDto
                    {
                        WorkOrderID = wo.Id,
                        SKU = wo.SKU,
                        TargetQuantity = wo.TargetQuantity,
                        Priority = wo.Priority,
                        PlannedStartTime = wo.PlannedStartTime,
                        Status = wo.Status,
                        ProductDefinitionStatus = pm.DefinitionStatus
                    };

        if (queryParams.SortBy?.ToLower() == "priority")
        {
            query = queryParams.SortDirection?.ToUpper() == "DESC"
                ? query.OrderByDescending(w => w.Priority == "High" ? 1 : w.Priority == "Medium" ? 2 : 3)
                       .ThenByDescending(w => w.PlannedStartTime)
                : query.OrderBy(w => w.Priority == "High" ? 1 : w.Priority == "Medium" ? 2 : 3)
                       .ThenBy(w => w.PlannedStartTime);
        }
        else
        {
            query = query.OrderBy(w => w.PlannedStartTime);
        }

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