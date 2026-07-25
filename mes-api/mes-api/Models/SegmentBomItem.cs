using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
public class SegmentBomItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int Id { get; set; }

        public string? MaterialDefinition { get; set; } 

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Quantity { get; set; } 

        public string? UnitOfMeasure { get; set; } 
        [JsonIgnore]
        public int? ProcessSegmentId { get; set; }
        [JsonIgnore]
        [ForeignKey("ProcessSegmentId")]
        public ProcessSegment? ProcessSegment { get; set; } = null!;
    }
