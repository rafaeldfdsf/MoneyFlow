/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DTO_Category } from "./DTO_Category";

export class DTO_Transactions {
    id!: number;
    userId!: number;
    categoryId!: number;
    isIncome!: boolean;
    amount!: number;
    description!: string;
    transactionDate!: Date;
    createdAt!: Date;
    category!: DTO_Category;
}
