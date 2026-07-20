using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;


public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<ProductMaster> ProductMasters { get; set; }
    public DbSet<ProcessSegment> ProcessSegments { get; set; }
    public DbSet<SegmentBomItem> SegmentBomItems { get; set; }
    public DbSet<PLCParameter> PLCParameters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProcessSegment>()
            .HasOne(s => s.ProductMaster)
            .WithMany(p => p.Segments)
            .HasForeignKey(s => s.ProductMasterId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SegmentBomItem>()
            .HasOne(b => b.ProcessSegment)
            .WithMany(s => s.BomItems)
            .HasForeignKey(b => b.ProcessSegmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PLCParameter>()
            .HasOne(p => p.ProcessSegment)
            .WithMany(s => s.Parameters)
            .HasForeignKey(p => p.ProcessSegmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
