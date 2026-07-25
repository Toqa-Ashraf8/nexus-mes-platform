
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace MesApp.Services
{
    public class SapSyncService : ISapSyncService
    {
        private readonly IWebHostEnvironment _env;
        private readonly DataContext _dbContext;

        public SapSyncService(IWebHostEnvironment env, DataContext dataContext)
        {
            _env = env;
            _dbContext = dataContext;
        }

        public List<ProductMasterDTO> ParseSapXmlData()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "MockSAPData", "ProductsSync.xml");

            if (!System.IO.File.Exists(filePath))
                filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "MockSAPData", "ProductsSync.xml");

            if (!System.IO.File.Exists(filePath))
                throw new FileNotFoundException($"XML file could not be found anywhere! Looked at: {filePath}");

            var xDoc = XDocument.Load(filePath);

            return xDoc.Descendants("ProductDefinition")
                .Select(p => new ProductMasterDTO
                {
                    SKU = p.Element("SKU")?.Value ?? string.Empty,
                    Description = p.Element("Description")?.Value ?? string.Empty,
                    Version = p.Element("Version")?.Value ?? "1.0",
                    DefinitionStatus = "New",
                    ProductSegments = p.Elements("ProductSegment")
                        .Select(s => new ProcessSegmentDTO
                        {
                            SequenceNo = int.TryParse(s.Element("SequenceNo")?.Value, out var seq) ? seq : 0,
                            SequenceName = s.Element("SequenceName")?.Value ?? string.Empty,

                            EquipmentRequirements = s.Elements("EquipmentRequirement")
                                .Select(m => new EquipmentRequirementDTO
                                {
                                    EquipmentClassID = string.IsNullOrWhiteSpace(m.Element("EquipmentClassID")?.Value) ? null : m.Element("EquipmentClassID")?.Value,
                                    EquipmentClassName = string.IsNullOrWhiteSpace(m.Element("EquipmentClassName")?.Value) ? null : m.Element("EquipmentClassName")?.Value
                                }).ToList(),

                            MaterialRequirements = s.Elements("MaterialRequirement")
                                .Select(m => new SegmentBomItemDTO
                                {
                                    MaterialDefinition = string.IsNullOrWhiteSpace(m.Element("MaterialDefinition")?.Value) ? null : m.Element("MaterialDefinition")?.Value,
                                    Quantity = decimal.TryParse(m.Element("Quantity")?.Value, out var q) ? q : 0,
                                    UnitOfMeasure = string.IsNullOrWhiteSpace(m.Element("UnitOfMeasure")?.Value) ? null : m.Element("UnitOfMeasure")?.Value
                                }).ToList(),

                            PersonnelRequirements = s.Elements("PersonnelRequirement")
                                .Select(pe => new PersonnelRequirementDTO
                                {
                                    PersonnelClassID = string.IsNullOrWhiteSpace(pe.Element("PersonnelClassID")?.Value) ? null : pe.Element("PersonnelClassID")?.Value,
                                    PersonnelClassName = string.IsNullOrWhiteSpace(pe.Element("PersonnelClassName")?.Value) ? null : pe.Element("PersonnelClassName")?.Value
                                }).ToList(),

                            Parameters = s.Elements("Parameter")
                                .Select(pa => new PLCParameterDTO
                                {
                                    Tag = string.IsNullOrWhiteSpace(pa.Element("Tag")?.Value) ? null : pa.Element("Tag")?.Value,
                                    Value = decimal.TryParse(pa.Element("Value")?.Value, out var val) ? val : 0,
                                    UnitOfMeasure = string.IsNullOrWhiteSpace(pa.Element("UnitOfMeasure")?.Value) ? null : pa.Element("UnitOfMeasure")?.Value
                                }).ToList()
                        }).ToList()
                }).ToList();
        }

        public async Task<List<ProductMaster>> SaveSapProductsToDb()
        {
            List<ProductMasterDTO> dtos = ParseSapXmlData();

            var existingSkus = await _dbContext.ProductMasters
                .Select(p => p.SKU)
                .ToListAsync();

            var newDtos = dtos.Where(d => !existingSkus.Contains(d.SKU)).ToList();

            if (!newDtos.Any())
                return new List<ProductMaster>(); 

            List<ProductMaster> entitiesToSave = newDtos.Select(dto => new ProductMaster
            {
                SKU = dto.SKU,
                Description = dto.Description,
                Version = dto.Version,
                DefinitionStatus = "New",
                ProductSegments = dto.ProductSegments.Select(s => new ProcessSegment
                {
                    SequenceNo = s.SequenceNo,
                    SequenceName = s.SequenceName,
                    EquipmentRequirements = s.EquipmentRequirements.Select(eq => new EquipmentRequirement
                    {
                        EquipmentClassID = eq.EquipmentClassID,
                        EquipmentClassName = eq.EquipmentClassName
                    }).ToList(),
                    PersonnelRequirements = s.PersonnelRequirements.Select(pe => new PersonnelRequirement
                    {
                        PersonnelClassID = pe.PersonnelClassID,
                        PersonnelClassName = pe.PersonnelClassName
                    }).ToList(),
                    MaterialRequirements = s.MaterialRequirements.Select(mat => new SegmentBomItem
                    {
                        MaterialDefinition = mat.MaterialDefinition,
                        Quantity = mat.Quantity,
                        UnitOfMeasure = mat.UnitOfMeasure
                    }).ToList(),
                    Parameters = s.Parameters.Select(p => new PLCParameter
                    {
                        Tag = p.Tag,
                        Value = p.Value,
                        UnitOfMeasure = p.UnitOfMeasure
                    }).ToList()
                }).ToList()
            }).ToList();

            await _dbContext.ProductMasters.AddRangeAsync(entitiesToSave);
            await _dbContext.SaveChangesAsync();

            return entitiesToSave;
        }
    }
}


