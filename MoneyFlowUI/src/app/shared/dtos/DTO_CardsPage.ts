import { DTO_Card } from './DTO_Card';

export class DTO_CardsPage {
    cards: DTO_Card[] = [];
    totalCardsCount = 0;
    activeCardsCount = 0;
    creditCardsCount = 0;
    debitCardsCount = 0;
    latestCardName = 'Sem dados';
    latestCardCreatedAt: string | null = null;
}
