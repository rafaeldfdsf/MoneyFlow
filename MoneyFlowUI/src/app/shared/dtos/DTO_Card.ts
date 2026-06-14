export class DTO_Card {
    id = 0;
    userId = 0;
    name = '';
    cardType = 'Debit';
    cardTypeLabel = 'Débito';
    brand: string | null = null;
    last4Digits: string | null = null;
    maskedNumber = 'Sem final';
    creditLimit: number | null = null;
    closingDay: number | null = null;
    dueDay: number | null = null;
    isActive = true;
    createdAt?: Date | string | null = null;
}
