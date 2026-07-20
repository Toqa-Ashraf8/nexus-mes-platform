using System.Xml.Linq;


namespace MesApp.Services
{
    public class SapSyncService : ISapSyncService
    {
        private readonly IWebHostEnvironment _env;

        public SapSyncService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public List<ProductDefinitionDto> ParseSapXmlData()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "MockSAPData", "ProductsSync.xml");

            if (!System.IO.File.Exists(filePath))
            {
                filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "MockSAPData", "ProductsSync.xml");
            }

            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException($"XML file could not be found anywhere! Looked at: {filePath}");
            }

            var xDoc = XDocument.Load(filePath);

            var products = xDoc.Descendants("ProductDefinition")
                .Select(p => new ProductDefinitionDto
                {
                    ID = p.Element("ID")?.Value ?? string.Empty,
                    Description = p.Element("Description")?.Value ?? string.Empty,
                    Version = p.Element("Version")?.Value ?? "1.0",

                    ProductSegments = p.Elements("ProductSegment")
                        .Select(s => new ProductSegmentDto
                        {
                            ID = s.Element("ID")?.Value ?? string.Empty,
                            Description = s.Element("Description")?.Value ?? string.Empty,

                            MaterialRequirements = s.Elements("MaterialRequirement")
                                .Select(m => new MaterialRequirementDto
                                {
                                    MaterialDefinitionID = m.Element("MaterialDefinitionID")?.Value ?? string.Empty,
                                    Quantity = double.TryParse(m.Element("Quantity")?.Value, out var q) ? q : 0,
                                    UnitOfMeasure = m.Element("UnitOfMeasure")?.Value ?? "pcs"
                                }).ToList(),

                            PersonnelRequirements = s.Elements("PersonnelRequirement")
                                .Select(pe => new PersonnelRequirementDto
                                {
                                    PersonnelClassID = pe.Element("PersonnelClassID")?.Value ?? string.Empty
                                }).ToList(),

                            Parameters = s.Elements("Parameter")
                                .Select(pa => new ParameterDto
                                {
                                    ID = pa.Element("ID")?.Value ?? string.Empty,
                                    Value = pa.Element("Value")?.Value ?? string.Empty,
                                    UnitOfMeasure = pa.Element("UnitOfMeasure")?.Value ?? string.Empty
                                }).ToList()
                        }).ToList()
                }).ToList();

            return products;
        }
    }
}