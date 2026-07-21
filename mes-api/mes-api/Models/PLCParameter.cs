using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


public class PLCParameter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int PlcParameterId { get; set; }

        [Required]
        [StringLength(50)]
        public string Tag { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Value { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Tolerance { get; set; }

        [StringLength(20)]
        public string? UnitOfMeasure { get; set; }
        [JsonIgnore]
        public int? ProcessSegmentId { get; set; }
        [JsonIgnore]
        [ForeignKey("ProcessSegmentId")]
        public ProcessSegment? ProcessSegment { get; set; } = null!;
    }
