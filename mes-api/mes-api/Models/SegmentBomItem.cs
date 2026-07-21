using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
public class SegmentBomItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string MaterialDefinitionID { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Quantity { get; set; } 

        [StringLength(10)]
        public string UnitOfMeasure { get; set; } = "pcs";
        [JsonIgnore]
        public int? ProcessSegmentId { get; set; }
        [JsonIgnore]
        [ForeignKey("ProcessSegmentId")]
        public ProcessSegment? ProcessSegment { get; set; } = null!;
    }
