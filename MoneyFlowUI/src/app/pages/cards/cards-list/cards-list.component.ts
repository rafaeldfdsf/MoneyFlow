import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Injector, TemplateRef, ViewChild, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { CardsService } from '@/services/Cards.service';
import { GenericTableComponent } from '@/shared/components/generic-table/generic-table';
import { DTO_Card } from '@/shared/dtos/DTO_Card';
import { TableColumnDefinition } from '@/shared/models/table-column.model';
import { ToastService } from '@/shared/services/toast.service';
import { CardsFormComponent } from '../cards-form/cards-form.component';

@Component({
    selector: 'app-cards-list',
    imports: [Button, GenericTableComponent, ConfirmDialog, CommonModule, MessageModule, Toast, CardsFormComponent],
    providers: [ConfirmationService, MessageService, CurrencyPipe],
    templateUrl: './cards-list.component.html',
    styleUrl: './cards-list.component.scss'
})
export class CardsListComponent {
    // Estado principal da página.
    cards = signal<DTO_Card[]>([]);
    totalCardsCount = signal(0);
    activeCardsCount = signal(0);
    creditCardsCount = signal(0);
    debitCardsCount = signal(0);
    latestCardName = signal('Sem dados');
    latestCardCreatedAt = signal<string | null>(null);
    loading = signal(false);

    // Estado do diálogo e da seleção da tabela.
    selectedCustomer: any;
    dialogInjector!: Injector;
    selectedCard: DTO_Card = new DTO_Card();
    isEdit = false;
    dialogVisible = false;
    selectedCards: DTO_Card[] = [];
    SelectedRowId = 0;
    columns: TableColumnDefinition<DTO_Card>[] = [];

    // Templates usados para renderizar colunas com apresentação própria.
    @ViewChild('typeTemplate', { static: true })
    typeTemplate!: TemplateRef<any>;

    @ViewChild('statusTemplate', { static: true })
    statusTemplate!: TemplateRef<any>;

    @ViewChild('limitTemplate', { static: true })
    limitTemplate!: TemplateRef<any>;

    /**
     * Define as colunas depois dos templates estarem disponíveis.
     */
    ngAfterViewInit() {
        this.columns = [
            { field: 'name', header: 'Cartão', sortable: true },
            { field: 'cardTypeLabel', header: 'Tipo', sortable: true, width: '130px', align: 'center', template: this.typeTemplate },
            { field: 'brand', header: 'Marca', sortable: true, width: '140px' },
            { field: 'maskedNumber', header: 'Final', sortable: true, width: '130px', align: 'center' },
            { field: 'creditLimit', header: 'Limite', sortable: true, width: '140px', align: 'right', template: this.limitTemplate },
            { field: 'isActive', header: 'Estado', sortable: true, width: '120px', align: 'center', template: this.statusTemplate }
        ];
    }

    constructor(
        private cardsService: CardsService,
        private injectorFactory: Injector,
        private confirmationService: ConfirmationService,
        private toast: ToastService
    ) { }

    /**
     * Carrega a grelha no arranque da página.
     */
    ngOnInit(): void {
        this.loadCards();
    }

    /**
     * Vai buscar a lista de cartões e os indicadores agregados da página.
     */
    loadCards(): void {
        this.loading.set(true);

        this.cardsService.getAll().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.cards.set(data);
                    this.totalCardsCount.set(data.length);
                    this.activeCardsCount.set(data.filter(card => card.isActive).length);
                    this.creditCardsCount.set(data.filter(card => card.cardType === 'Credit').length);
                    this.debitCardsCount.set(data.filter(card => card.cardType === 'Debit').length);
                    this.latestCardName.set(data[0]?.name ?? 'Sem dados');
                    this.latestCardCreatedAt.set(data[0]?.createdAt?.toString() ?? null);
                    this.loading.set(false);
                    return;
                }

                this.cards.set(data?.cards ?? []);
                this.totalCardsCount.set(data?.totalCardsCount ?? 0);
                this.activeCardsCount.set(data?.activeCardsCount ?? 0);
                this.creditCardsCount.set(data?.creditCardsCount ?? 0);
                this.debitCardsCount.set(data?.debitCardsCount ?? 0);
                this.latestCardName.set(data?.latestCardName ?? 'Sem dados');
                this.latestCardCreatedAt.set(data?.latestCardCreatedAt ?? null);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro:', err);
                this.loading.set(false);
            }
        });
    }

    /**
     * Abre o diálogo em modo de edição a partir da linha clicada.
     */
    onRowClick(row: DTO_Card) {
        this.isEdit = true;
        this.selectedCustomer = row;
        this.SelectedRowId = row.id;

        this.dialogInjector = Injector.create({
            providers: [{ provide: 'model', useValue: row }],
            parent: this.injectorFactory
        });

        this.dialogVisible = true;
    }

    /**
     * Prepara o modelo vazio para criação de um novo cartão.
     */
    openNew() {
        this.isEdit = false;
        this.selectedCard = new DTO_Card();
        this.selectedCard.cardType = 'Debit';
        this.selectedCard.isActive = true;
        this.dialogVisible = true;
    }

    /**
     * Indica se a seleção atual contém pelo menos um cartão ativo.
     */
    hasActiveSelection(): boolean {
        return this.selectedCards.some(card => card.isActive);
    }

    /**
     * Indica se a seleção atual contém pelo menos um cartão inativo.
     */
    hasInactiveSelection(): boolean {
        return this.selectedCards.some(card => !card.isActive);
    }

    /**
     * Ativa apenas os cartões selecionados que estão atualmente inativos.
     */
    activateSelectedCards() {
        const ids = this.selectedCards
            .filter(card => !card.isActive)
            .map(card => card.id);

        if (!ids.length) {
            return;
        }

        this.cardsService.activate(ids).subscribe({
            next: () => {
                this.toast.success('Cartões ativados com sucesso');
                this.loadCards();
                this.selectedCards = [];
            },
            error: (err) => this.toast.error(err)
        });
    }

    /**
     * Desativa apenas os cartões selecionados que estão atualmente ativos.
     */
    deactivateSelectedCards() {
        const ids = this.selectedCards
            .filter(card => card.isActive)
            .map(card => card.id);

        if (!ids.length) {
            return;
        }

        this.cardsService.deactivate(ids).subscribe({
            next: () => {
                this.toast.success('Cartões desativados com sucesso');
                this.loadCards();
                this.selectedCards = [];
            },
            error: (err) => this.toast.error(err)
        });
    }

    /**
     * Confirma a remoção em lote e atualiza a grelha quando concluída.
     */
    deleteSelectedCards() {
        this.confirmationService.confirm({
            header: 'Confirmar Eliminação',
            message: 'Tem a certeza de que pretende eliminar os cartões selecionados?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.cardsService.delete(this.selectedCards.map(card => card.id)).subscribe({
                    next: () => {
                        this.toast.success('Eliminado com sucesso');
                        this.loadCards();
                        this.selectedCards = [];
                    },
                    error: (err) => this.toast.error(err)
                });
            }
        });
    }

    /**
     * Mantém a seleção atual sincronizada com a tabela genérica.
     */
    onSelectionChange(rows: DTO_Card[]) {
        this.selectedCards = rows;
    }
}
