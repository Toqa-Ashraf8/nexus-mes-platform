
    public class WorkOrderParametersDTO
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? SortBy { get; set; } = "Priority"; // Priority, StartDate
        public string? SortDirection { get; set; } = "ASC"; // ASC, DESC

    }
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

        public class WorkOrderListDto
        {
            public int WorkOrderID { get; set; }
            public string SKU { get; set; } = string.Empty;
            public int TargetQuantity { get; set; }
            public string Priority { get; set; } = string.Empty;
            public DateTime PlannedStartTime { get; set; }
            public string Status { get; set; } = string.Empty;
            public string ProductDefinitionStatus { get; set; } = string.Empty;
        }
