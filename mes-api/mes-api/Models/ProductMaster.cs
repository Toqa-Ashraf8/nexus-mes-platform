using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class ProductMaster
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonIgnore]
    public int ProductMasterId { get; set; }

    [Required]
    [StringLength(50)]
    public string SKU { get; set; } 

    [Required]
    [StringLength(10)]
    public string Version { get; set; } = "1.0";

    public string? Description { get; set; }
    [JsonIgnore]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public string DefinitionStatus { get; set; } 

    public ICollection<ProcessSegment> ProductSegments { get; set; } = new List<ProcessSegment>();




}

