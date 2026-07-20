using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
    public class ProcessSegment
    {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int SequenceNo { get; set; } 

    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    public int? RequiredPersonnelClassId { get; set; }


    [StringLength(50)]
    public string? EquipmentClass { get; set; } 

    public string? Instructions { get; set; }

    [Required]
    public int ProductMasterId { get; set; }

    [ForeignKey("ProductMasterId")]
    public ProductMaster ProductMaster { get; set; } = null!;

    public ICollection<SegmentBomItem> BomItems { get; set; } = new List<SegmentBomItem>();
    public ICollection<PLCParameter> Parameters { get; set; } = new List<PLCParameter>();





}

