using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class WorkOrder
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string WorkOrderNumber { get; set; }

    [Required]
    [MaxLength(100)]
    public string SKU { get; set; } 

    public int TargetQuantity { get; set; }

    public int CompletedQuantity { get; set; }
    public string WorkCenterName { get; set; }
    public int? WorkCenterId { get; set; }

    [ForeignKey(nameof(WorkCenterId))]
    public virtual WorkCenter? WorkCenter { get; set; }

    [MaxLength(20)]
    public string Priority { get; set; } 

    [MaxLength(30)]
    public string Status { get; set; } 

    public DateTime PlannedStartTime { get; set; }
    public DateTime PlannedEndTime { get; set; }

    public bool HasException { get; set; } = false;

    [MaxLength(500)]
    public string? ExceptionMessage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}