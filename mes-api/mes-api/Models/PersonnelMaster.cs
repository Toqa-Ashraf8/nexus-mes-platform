using System.ComponentModel.DataAnnotations;

public class PersonnelMaster
{
    [Key]
    public string EmployeeId { get; set; } 

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [MaxLength(50)]
    public string PersonnelClassName { get; set; }

    [MaxLength(100)]
    public string Qualification { get; set; } 

    [Required]
    [MaxLength(50)]
    public string RfidTag { get; set; } 

    public bool IsActive { get; set; } 
}