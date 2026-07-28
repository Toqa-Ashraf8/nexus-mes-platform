
    public interface IWorkOrderService
    {
    Task<PagedResult<WorkOrderListDto>> GetReleasedWorkOrdersAsync(WorkOrderParametersDTO queryParams);
    }

