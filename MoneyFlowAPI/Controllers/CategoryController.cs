using Microsoft.AspNetCore.Mvc;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService) => _categoryService = categoryService;

        #region GET
        [HttpGet("categories")]
        public async Task<ActionResult<DTO_ResponseTable<List<DTO_Category>>>> GetAll()
        {
            var response = await _categoryService.GetAllCategoriesAsync(UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpGet("category/{id}")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Category>>> GetCategory(int id)
        {
            var response = await _categoryService.GetCategoryAsync(id);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region PUT
        [HttpPut("category")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Category>>> PutCategory(DTO_Category category)
        {
            var response = await _categoryService.UpdateCategoryAsync(category);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region POST
        [HttpPost("category")]
        public async Task<ActionResult<DTO_ResponseTable<DTO_Category>>> PostCategory(DTO_Category category)
        {
            var response = await _categoryService.CreateCategoryAsync(category, UserId);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion

        #region DELETE
        [HttpPost("categories")]
        public async Task<ActionResult<DTO_ResponseTable<string>>> PostCategories(List<int> categories)
        {
            var response = await _categoryService.DeleteCategoriesAsync(categories);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        #endregion
    }
}
