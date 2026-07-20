using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


    public class PLCParameter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Target { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Tolerance { get; set; }

        [StringLength(20)]
        public string? Unit { get; set; } 

        [Required]
        public int ProcessSegmentId { get; set; }

        [ForeignKey("ProcessSegmentId")]
        public ProcessSegment ProcessSegment { get; set; } = null!;
    }
