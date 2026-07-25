 public interface ISapSyncService
    {
        List<ProductMasterDTO> ParseSapXmlData();
        Task<List<ProductMaster>> SaveSapProductsToDb();
    }
