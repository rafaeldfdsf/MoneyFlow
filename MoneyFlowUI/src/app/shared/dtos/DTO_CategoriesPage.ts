import { DTO_Category } from './DTO_Category';

export class DTO_CategoriesPage {
    categories: DTO_Category[] = [];
    totalCategoriesCount = 0;
    monthlyCategoriesCount = 0;
    latestCategoryName = 'Sem dados';
    latestCategoryCreatedAt: string | null = null;
}
