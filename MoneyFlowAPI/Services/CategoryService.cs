using AutoMapper;
using MoneyFlowAPI.Application.Categories;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly GetAllCategories _getAllCategories;
        private readonly GetCategory _getCategory;
        private readonly CreateCategory _createCategory;
        private readonly DeleteCategory _deleteCategories;
        private readonly UpdateCategory _updateCategory;
        private readonly IMapper _mapper;

        public CategoryService(GetAllCategories getAllCategories,
                                  GetCategory getCategory,
                                  CreateCategory createCategory,
                                  DeleteCategory deleteCategory,
                                  UpdateCategory updateCategory,
                                  IMapper mapper)
        {
            _getAllCategories = getAllCategories;
            _getCategory = getCategory;
            _createCategory = createCategory;
            _deleteCategories = deleteCategory;
            _updateCategory = updateCategory;
            _mapper = mapper;
        }

        #region GET
        public async Task<DTO_ResponseTable<List<DTO_Category>>> GetAllCategoriesAsync(int userId)
        {
            try
            {
                var transactions = await _getAllCategories.ExecuteAsync(userId);

                if (transactions == null || !transactions.Any())
                    return DTO_ResponseTable<List<DTO_Category>>.FailureResult("Nenhuma categoria encontrada.");

                var dtoList = _mapper.Map<List<DTO_Category>>(transactions);

                return DTO_ResponseTable<List<DTO_Category>>.SuccessResult(dtoList);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<List<DTO_Category>>.FailureResult($"Erro: {ex.Message}");
            }
        }

        public async Task<DTO_ResponseTable<DTO_Category>> GetCategoryAsync(int id)
        {
            try
            {
                Category? transaction = await _getCategory.ExecuteAsync(id);

                if (transaction == null)
                    return DTO_ResponseTable<DTO_Category>.FailureResult("Nenhuma categoria encontrada.");

                var dtoList = _mapper.Map<DTO_Category>(transaction);

                return DTO_ResponseTable<DTO_Category>.SuccessResult(dtoList);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Category>.FailureResult($"Erro: {ex.Message}");
            }
        }
        #endregion

        #region POST
        public async Task<DTO_ResponseTable<DTO_Category>> CreateCategoryAsync(DTO_Category dto, int userId)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Category>.FailureResult("Dados inválidos.");

                // Mapeia DTO -> Entidade (usando a entidade correta)
                Models.Category entity = _mapper.Map<Models.Category>(dto);

                // Executa comando/serviço de criação
                Models.Category? created = await _createCategory.ExecuteAsync(entity, userId);

                if (created == null)
                    return DTO_ResponseTable<DTO_Category>.FailureResult("Falha ao criar categoria.");

                // Mapeia Entidade -> DTO para retorno
                var createdDto = _mapper.Map<DTO_Category>(created);

                return DTO_ResponseTable<DTO_Category>.SuccessResult(
                    createdDto,
                    "Categoria criada com sucesso."
                );
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Category>.FailureResult(
                    $"Erro ao criar categoria: {ex.Message}"
                );
            }
        }
        #endregion

        #region PUT
        public async Task<DTO_ResponseTable<DTO_Category>> UpdateCategoryAsync(DTO_Category dto)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Category>.FailureResult("Dados inválidos.");

                // Mapeia DTO -> Entidade
                Category entity = _mapper.Map<Category>(dto);

                // Executa comando/serviço de atualização
                Category? updated = await _updateCategory.ExecuteAsync(entity);

                if (updated == null)
                    return DTO_ResponseTable<DTO_Category>.FailureResult("Falha ao atualizar categoria.");

                // Mapeia Entidade -> DTO para retorno
                var updatedDto = _mapper.Map<DTO_Category>(updated);

                return DTO_ResponseTable<DTO_Category>.SuccessResult(
                    updatedDto,
                    "Categoria atualizada com sucesso."
                );
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Category>.FailureResult(
                    $"Erro ao atualizar categoria: {ex.Message}"
                );
            }
        }
        #endregion

        #region DELETE
        public async Task<DTO_ResponseTable<string>> DeleteCategoriesAsync(List<int> categories)
        {
            try
            {
                if (categories == null || !categories.Any())
                    return DTO_ResponseTable<string>.FailureResult("Registos não encontrados.");

                // Executa serviço/command responsável pela exclusão    
                bool deleted = await _deleteCategories.ExecuteAsync(categories);

                if (!deleted)
                    return DTO_ResponseTable<string>.FailureResult("Falha ao excluir categoria.");

                return DTO_ResponseTable<string>.SuccessResult(
                    "Transações removidas com sucesso."
                );
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<string>.FailureResult(
                    $"Erro ao excluir transações: {ex.Message}"
                );
            }
        }
        #endregion
    }
}
