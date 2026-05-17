import { CommonModule } from '@angular/common';
import { Component, Injector, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { CategoriesService } from '@/services/Categories.service';
import { GenericTableComponent } from '@/shared/components/generic-table/generic-table';
import { DTO_Category } from '@/shared/dtos/DTO_Category';
import { TableColumnDefinition } from '@/shared/models/table-column.model';
import { ToastService } from '@/shared/services/toast.service';
import { CategoriesFormComponent } from '../../categories/categories-form/categories-form.component';

@Component({
    selector: 'app-categories-list',
    imports: [Button, GenericTableComponent, ConfirmDialog, CommonModule, MessageModule, Toast, CategoriesFormComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './categories-list.component.html',
    styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {
    // Lista de categorias vindas do backend.
    categories = signal<DTO_Category[]>([]);

    // Número total de categorias.
    totalCategoriesCount = signal(0);

    // Categorias criadas no mês atual.
    monthlyCategoriesCount = signal(0);

    // Nome da última categoria criada.
    latestCategoryName = signal('Sem dados');

    // Data da última categoria criada.
    latestCategoryCreatedAt = signal<string | null>(null);

    // Controla o estado de loading.
    loading = signal(false);

    // Guarda a linha atualmente selecionada.
    selectedCustomer: any;

    // Injector usado para passar dados dinamicamente para o formulário.
    dialogInjector!: Injector;

    // Categoria atualmente em edição/criação.
    selectedCategory: any = {};

    // Flag para distinguir entre criar ou editar.
    isEdit = false;

    // Controla a visibilidade do diálogo.
    dialogVisible = false;

    // Lista de categorias selecionadas.
    selectedCategories: DTO_Category[] = [];

    // ID da linha atualmente selecionada.
    SelectedRowId = 0;

    // Definição das colunas da tabela.
    columns: TableColumnDefinition<DTO_Category>[] = [];

    /**
     * Colunas da tabela.
     */
    ngAfterViewInit() {
        this.columns = [
            { field: 'name', header: 'Descrição', sortable: true }
        ];
    }

    constructor(
        private categoriesService: CategoriesService,
        private injectorFactory: Injector,
        private confirmationService: ConfirmationService,
        private toast: ToastService
    ) { }

    /**
     * Carrega os dados iniciais.
     */
    ngOnInit(): void {
        this.loadCategories();
    }

    /**
     * Vai buscar os registos para a grelha e os indicadores da página.
     */
    loadCategories(): void {
        this.loading.set(true);
        this.categoriesService.getAll().subscribe({
            next: (data) => {
                this.categories.set(data?.categories ?? []);
                this.totalCategoriesCount.set(data?.totalCategoriesCount ?? 0);
                this.monthlyCategoriesCount.set(data?.monthlyCategoriesCount ?? 0);
                this.latestCategoryName.set(data?.latestCategoryName ?? 'Sem dados');
                this.latestCategoryCreatedAt.set(data?.latestCategoryCreatedAt ?? null);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro:', err);
                this.loading.set(false);
            }
        });
    }

    /**
     * Executa quando o utilizador clica numa linha.
     * Abre o diálogo em modo edição.
     */
    onRowClick(row: DTO_Category) {
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
     * Abre o diálogo para criar um novo registo.
     */
    openNew() {
        this.isEdit = false;
        this.selectedCategory = {
            name: ''
        };
        this.dialogVisible = true;
    }

    /**
     * Abre um diálogo de confirmação e elimina os registos selecionados.
     */
    deleteSelectedProducts() {
        this.confirmationService.confirm({
            header: 'Confirmar Eliminação',
            message: 'Tem a certeza de que pretende eliminar os itens selecionados?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.categoriesService.delete(this.selectedCategories.map((item) => item.id)).subscribe({
                    next: () => {
                        this.toast.success('Eliminado com sucesso');
                        this.loadCategories();
                        this.selectedCategories = [];
                    },
                    error: (err) => {
                        this.toast.error(err);
                    }
                });
            }
        });
    }

    /**
     * Atualiza a lista de linhas selecionadas na tabela.
     */
    onSelectionChange(rows: DTO_Category[]) {
        this.selectedCategories = rows;
    }
}
