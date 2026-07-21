
    public class ProcessDefinitionRepository:IProcessDefinitionRepository
    {

    private readonly DataContext dbcontext;
    public ProcessDefinitionRepository(DataContext dataContext)
    {
        dbcontext = dataContext;
    }

    public async Task <bool> ReleaseDefinition(ProductMaster product)
    {
       await  dbcontext.ProductMasters.AddAsync(product);
        var result = await dbcontext.SaveChangesAsync();
        if (result > 0)
        {
            return true;
        }
        return false;
       
    }

    }

