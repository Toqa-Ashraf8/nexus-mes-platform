
    public class ProcessSegmentDTO
    {

    public int SequenceNo { get; set; }
    public string SequenceName { get; set; }
    public ICollection<EquipmentRequirementDTO>? EquipmentRequirements { get; set; } = new List<EquipmentRequirementDTO>();
    public ICollection<PersonnelRequirementDTO>? PersonnelRequirements { get; set; } = new List<PersonnelRequirementDTO>();

    public ICollection<SegmentBomItemDTO>? MaterialRequirements { get; set; } = new List<SegmentBomItemDTO>();
    public ICollection<PLCParameterDTO>? Parameters { get; set; } = new List<PLCParameterDTO>();

    }
    public class EquipmentRequirementDTO
    {
    public string? EquipmentClassID { get; set; }
    public string? EquipmentClassName { get; set; }
    }
    public class PersonnelRequirementDTO
    {
    public string? PersonnelClassID { get; set; }
    public string? PersonnelClassName { get; set; }
    }


    public class SegmentBomItemDTO
    {
   
    public string? MaterialDefinition { get; set; }

    public decimal? Quantity { get; set; }

    public string? UnitOfMeasure { get; set; }
    }
    public class PLCParameterDTO
    {
        public string? Tag { get; set; }

        public decimal? Value { get; set; }
        public string? UnitOfMeasure { get; set; }
    }



