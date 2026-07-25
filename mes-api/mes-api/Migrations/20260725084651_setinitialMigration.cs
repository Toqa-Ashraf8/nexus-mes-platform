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
                    ProductMasterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SKU = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Version = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DefinitionStatus = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductMasters", x => x.ProductMasterId);
                });

            migrationBuilder.CreateTable(
                name: "ProcessSegments",
                columns: table => new
                {
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SequenceNo = table.Column<int>(type: "int", nullable: false),
                    SequenceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    standardTimeMin = table.Column<decimal>(type: "decimal(18,1)", nullable: true),
                    ProductMasterId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcessSegments", x => x.ProcessSegmentId);
                    table.ForeignKey(
                        name: "FK_ProcessSegments_ProductMasters_ProductMasterId",
                        column: x => x.ProductMasterId,
                        principalTable: "ProductMasters",
                        principalColumn: "ProductMasterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentRequirement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentClassID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EquipmentClassName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentRequirement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EquipmentRequirement_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "ProcessSegmentId");
                });

            migrationBuilder.CreateTable(
                name: "PersonnelRequirement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonnelClassID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PersonnelClassName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelRequirement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonnelRequirement_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "ProcessSegmentId");
                });

            migrationBuilder.CreateTable(
                name: "PLCParameters",
                columns: table => new
                {
                    PlcParameterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Value = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Tolerance = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UnitOfMeasure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PLCParameters", x => x.PlcParameterId);
                    table.ForeignKey(
                        name: "FK_PLCParameters_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "ProcessSegmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SegmentBomItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaterialDefinition = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UnitOfMeasure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SegmentBomItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SegmentBomItems_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "ProcessSegmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkInstructionSteps",
                columns: table => new
                {
                    StepId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StepSequence = table.Column<int>(type: "int", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessSegmentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkInstructionSteps", x => x.StepId);
                    table.ForeignKey(
                        name: "FK_WorkInstructionSteps_ProcessSegments_ProcessSegmentId",
                        column: x => x.ProcessSegmentId,
                        principalTable: "ProcessSegments",
                        principalColumn: "ProcessSegmentId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentRequirement_ProcessSegmentId",
                table: "EquipmentRequirement",
                column: "ProcessSegmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelRequirement_ProcessSegmentId",
                table: "PersonnelRequirement",
                column: "ProcessSegmentId");

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

            migrationBuilder.CreateIndex(
                name: "IX_WorkInstructionSteps_ProcessSegmentId",
                table: "WorkInstructionSteps",
                column: "ProcessSegmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EquipmentRequirement");

            migrationBuilder.DropTable(
                name: "PersonnelRequirement");

            migrationBuilder.DropTable(
                name: "PLCParameters");

            migrationBuilder.DropTable(
                name: "SegmentBomItems");

            migrationBuilder.DropTable(
                name: "WorkInstructionSteps");

            migrationBuilder.DropTable(
                name: "ProcessSegments");

            migrationBuilder.DropTable(
                name: "ProductMasters");
        }
    }
}
