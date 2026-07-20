 public class ProductDefinitionDto
    {
        public string ID { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public List<ProductSegmentDto> ProductSegments { get; set; } = new();
    }

    public class ProductSegmentDto
    {
        public string ID { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<MaterialRequirementDto> MaterialRequirements { get; set; } = new();
        public List<PersonnelRequirementDto> PersonnelRequirements { get; set; } = new();
        public List<ParameterDto> Parameters { get; set; } = new();
    }

    public class MaterialRequirementDto
    {
        public string MaterialDefinitionID { get; set; } = string.Empty;
        public double Quantity { get; set; }
        public string UnitOfMeasure { get; set; } = string.Empty;
    }

    public class PersonnelRequirementDto
    {
        public string PersonnelClassID { get; set; } = string.Empty;
    }

    public class ParameterDto
    {
        public string ID { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;
    }
