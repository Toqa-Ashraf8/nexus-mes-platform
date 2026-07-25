    public class ProductMasterDTO
    {

    public string SKU { get; set; }

    public string Version { get; set; } 

    public string Description { get; set; }
 
    public string? DefinitionStatus { get; set; }

    public ICollection<ProcessSegmentDTO> ProductSegments { get; set; } = new List<ProcessSegmentDTO>();
}

