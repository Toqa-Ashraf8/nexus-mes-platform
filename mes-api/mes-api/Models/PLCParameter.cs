using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


public class PLCParameter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int PlcParameterId { get; set; }
        public string? Tag { get; set; } 
   
        public decimal? Value { get; set; } 
        public decimal? Tolerance { get; set; }
        public string? UnitOfMeasure { get; set; }
        [JsonIgnore]
        public int? ProcessSegmentId { get; set; }
        [JsonIgnore]
        [ForeignKey("ProcessSegmentId")]
        public ProcessSegment? ProcessSegment { get; set; } = null!;
    }
