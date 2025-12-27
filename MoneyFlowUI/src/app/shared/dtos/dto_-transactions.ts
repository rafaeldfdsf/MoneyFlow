/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DTO_Category } from "./dto_-category";

export class DTO_Transactions {
    id: number;
    userId: number;
    categoryId: number;
    isIncome: boolean;
    type: string = "";
    amount: number;
    description: string;
    transactionDate: Date = new Date("2025-12-26T00:00:00.0000000+00:00");
    transactionDate1: Date = new Date("2025-12-26T00:00:00.0000000+00:00");
    createdAt: Date;
    category: DTO_Category;
}
