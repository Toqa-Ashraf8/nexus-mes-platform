using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductMaster
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string SKU { get; set; } 

    [Required]
    [StringLength(10)]
    public string Version { get; set; } = "1.0";

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProcessSegment> Segments { get; set; } = new List<ProcessSegment>();




}

