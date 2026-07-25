
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class WorkInstructionStep
    {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonIgnore]

    public int StepId { get; set; }
    public int? StepSequence { get; set; } // ترتيب الخطوة داخل المرحلة (1, 2, 3...)
    public string? Category { get; set; } // safety - Quality - production 
    public string? CategoryUrl { get; set; }
    public string? Description { get; set; } // وصف الخطوة (مثلاً: "قم بتركيب المسمار الأيمن")

    public string? ImageUrl { get; set; }  // رابط صورة توضيحية للخطوة
    public string? VideoUrl { get; set; } // رابط فيديو قصير للطريقة الصحيحة

    [JsonIgnore]
    public int? ProcessSegmentId { get; set; }
    [ForeignKey("ProcessSegmentId")]
    [JsonIgnore]
    public ProcessSegment? ProcessSegment { get; set; }
}

