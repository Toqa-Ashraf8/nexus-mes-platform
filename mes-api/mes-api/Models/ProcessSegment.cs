using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
public class ProcessSegment
    {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProcessSegmentId { get; set; }

    [Required]
    public int SequenceNo { get; set; }
    [Required]
    public string SequenceName { get; set; }
    [Column(TypeName = "decimal(18,1)")]
    public decimal standardTimeMin { get; set; }
    [JsonIgnore]
    public int? ProductMasterId { get; set; }
    [ForeignKey("ProductMasterId")]
    [JsonIgnore]
    public ProductMaster? ProductMasters { get; set; }
    public ICollection<EquipmentRequirement> EquipmentRequirements { get; set; } = new List<EquipmentRequirement>();
    public ICollection<PersonnelRequirement> PersonnelRequirements { get; set; } = new List<PersonnelRequirement>();
    public string? Instructions { get; set; }

    public ICollection<SegmentBomItem> MaterialRequirements { get; set; } = new List<SegmentBomItem>();
    public ICollection<PLCParameter> Parameters { get; set; } = new List<PLCParameter>();


    }

