
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic; 
public class WorkCenter
    {

    [Key]
    public int WorkCenterId { get; set; }

    [Required]
    [StringLength(50)]
    public string WorkCenterName { get; set; }

    public string Description { get; set; } 

    public string EquipmentClassName { get; set; }

    public string Department { get; set; } 

    public bool IsActive { get; set; } = true;

    public DateTime LastSyncDate { get; set; } = DateTime.Now;

    public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
}

