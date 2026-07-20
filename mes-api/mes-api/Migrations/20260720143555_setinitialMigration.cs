using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mes_api.Migrations
{
    /// <inheritdoc />
    public partial class setinitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductMasters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SKU = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Version = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductMasters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProcessSegments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SequenceNo = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EquipmentClass = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductMasterId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcessSegments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProcessSegments_ProductMasters_ProductMasterId",
                        column: x => x.ProductMasterId,
                        principalTable: "ProductMasters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PLCParameters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Target = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Tolerance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PLCParameters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PLCParameters_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SegmentBomItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaterialId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Uom = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SegmentBomItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SegmentBomItems_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PLCParameters_ProcessSegmentId",
                table: "PLCParameters",
                column: "ProcessSegmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ProcessSegments_ProductMasterId",
                table: "ProcessSegments",
                column: "ProductMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_SegmentBomItems_ProcessSegmentId",
                table: "SegmentBomItems",
                column: "ProcessSegmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PLCParameters");

            migrationBuilder.DropTable(
                name: "SegmentBomItems");

            migrationBuilder.DropTable(
                name: "ProcessSegments");

            migrationBuilder.DropTable(
                name: "ProductMasters");
        }
    }
}
