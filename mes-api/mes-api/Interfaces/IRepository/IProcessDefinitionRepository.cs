
    public interface IProcessDefinitionRepository
    {
        Task<List<ProductMaster>> GetAllProducts();
         Task<ProductMaster?> GetProductBySku(string sku);
        Task<bool> ReleaseDefinition(ProductMaster product);

    }

