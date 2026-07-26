
using System.ComponentModel.DataAnnotations;

public class WorkOrder
    {
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string WorkOrderNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string SKU { get; set; } = string.Empty;

    public int TargetQuantity { get; set; }

    public int CompletedQuantity { get; set; }

    [MaxLength(100)]
    public string WorkCenterId { get; set; } = string.Empty;


    [MaxLength(20)]
    public string Priority { get; set; }

    [MaxLength(30)]
    public string Status { get; set; } = "New";

    public DateTime PlannedStartTime { get; set; }
    public DateTime PlannedEndTime { get; set; }

    public bool HasException { get; set; } = false;

    [MaxLength(500)]
    public string? ExceptionMessage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


}




