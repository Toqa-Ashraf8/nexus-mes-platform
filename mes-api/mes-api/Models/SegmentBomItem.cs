using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
 public class SegmentBomItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string MaterialId { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Quantity { get; set; } 

        [StringLength(10)]
        public string Uom { get; set; } = "pcs"; 

        [Required]
        public int ProcessSegmentId { get; set; }

        [ForeignKey("ProcessSegmentId")]
        public ProcessSegment ProcessSegment { get; set; } = null!;
    }
