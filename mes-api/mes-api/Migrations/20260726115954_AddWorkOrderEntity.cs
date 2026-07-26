using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mes_api.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkOrderEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkOrderNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SKU = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TargetQuantity = table.Column<int>(type: "int", nullable: false),
                    CompletedQuantity = table.Column<int>(type: "int", nullable: false),
                    WorkCenterId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    PlannedStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlannedEndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HasException = table.Column<bool>(type: "bit", nullable: false),
                    ExceptionMessage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrders", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkOrders");
        }
    }
}
