
using Microsoft.EntityFrameworkCore;
 
public class ProcessDefinitionRepository : IProcessDefinitionRepository
{
    private readonly DataContext _dbcontext;

    public ProcessDefinitionRepository(DataContext dataContext)
    {
        _dbcontext = dataContext;
    }

    public async Task<List<ProductMaster>> GetAllProducts()
    {
        return await _dbcontext.ProductMasters
         .Where(p => p.DefinitionStatus == "New")
         .Include(p => p.ProductSegments)
             .ThenInclude(s => s.WorkInstructionSteps)
         .Include(p => p.ProductSegments)
             .ThenInclude(s => s.EquipmentRequirements)
         .Include(p => p.ProductSegments)
             .ThenInclude(s => s.PersonnelRequirements)
         .Include(p => p.ProductSegments)
             .ThenInclude(s => s.MaterialRequirements)
         .Include(p => p.ProductSegments)
             .ThenInclude(s => s.Parameters)
         .AsSplitQuery()
         .AsNoTracking()
         .ToListAsync();
    }

    public async Task<ProductMaster?> GetProductBySku(string sku)
    {
        return await _dbcontext.ProductMasters
            .Where(p => p.SKU == sku)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.WorkInstructionSteps)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.EquipmentRequirements)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.PersonnelRequirements)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.MaterialRequirements)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.Parameters)
            .AsSplitQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ReleaseDefinition(ProductMaster product)
    {
        if (product == null || string.IsNullOrWhiteSpace(product.SKU)) return false;

        var existingProduct = await _dbcontext.ProductMasters
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.WorkInstructionSteps)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.EquipmentRequirements)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.PersonnelRequirements)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.MaterialRequirements)
            .Include(p => p.ProductSegments)
                .ThenInclude(s => s.Parameters)
            .FirstOrDefaultAsync(p => p.SKU == product.SKU);

        if (existingProduct == null) return false;

     
        CopyNonNullProperties(product, existingProduct);
        existingProduct.DefinitionStatus = "Released";

        if (product.ProductSegments != null && product.ProductSegments.Any())
        {
            foreach (var inSeg in product.ProductSegments)
            {
                var dbSeg = existingProduct.ProductSegments
                    .FirstOrDefault(s => s.ProcessSegmentId == inSeg.ProcessSegmentId && inSeg.ProcessSegmentId != 0);

                if (dbSeg != null)
                {
                    
                    CopyNonNullProperties(inSeg, dbSeg);

                    SyncChildCollectionIncremental(dbSeg.WorkInstructionSteps, inSeg.WorkInstructionSteps, x => x.StepId);
                    SyncChildCollectionIncremental(dbSeg.EquipmentRequirements, inSeg.EquipmentRequirements, x => x.Id);
                    SyncChildCollectionIncremental(dbSeg.PersonnelRequirements, inSeg.PersonnelRequirements, x => x.Id);
                    SyncChildCollectionIncremental(dbSeg.MaterialRequirements, inSeg.MaterialRequirements, x => x.Id);
                    SyncChildCollectionIncremental(dbSeg.Parameters, inSeg.Parameters, x => x.PlcParameterId);
                }
                else
                {
                    
                    inSeg.ProcessSegmentId = 0; 
                    inSeg.ProductMasterId = existingProduct.ProductMasterId;
                    existingProduct.ProductSegments.Add(inSeg);
                }
            }
        }

        var result = await _dbcontext.SaveChangesAsync();
        return result > 0;
    }

    #region Repository Private Data Utilities

    private void SyncChildCollectionIncremental<TEntity, TKey>(
        ICollection<TEntity> dbCollection,
        IEnumerable<TEntity>? incomingCollection,
        Func<TEntity, TKey> keySelector) where TEntity : class
    {
        if (incomingCollection == null || !incomingCollection.Any()) return;

        foreach (var inItem in incomingCollection)
        {
            var inKey = keySelector(inItem);
            var dbItem = dbCollection.FirstOrDefault(item => Equals(keySelector(item), inKey) && !Equals(inKey, default(TKey)));

            if (dbItem != null)
                CopyNonNullProperties(inItem, dbItem);   
            else
                dbCollection.Add(inItem);          
        }
    }

    private void CopyNonNullProperties<T>(T source, T destination)
    {
        var properties = typeof(T).GetProperties();
        foreach (var prop in properties)
        {
            if (prop.Name.EndsWith("Id"))
                continue;

            if (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(ICollection<>))
                continue;

            if (prop.PropertyType.IsClass && prop.PropertyType != typeof(string))
                continue;

            var sourceValue = prop.GetValue(source);

            if (sourceValue != null)
            {
                prop.SetValue(destination, sourceValue);
            }
        }
    }

    #endregion
}