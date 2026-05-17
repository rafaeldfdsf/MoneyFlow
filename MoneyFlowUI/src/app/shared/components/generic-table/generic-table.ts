import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, output, PipeTransform, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-generic-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TagModule,
    ProgressBarModule
  ],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.scss'
})
export class GenericTableComponent<T> {
  // Inputs reativos.
  title = input<string>('');
  data = input<T[]>([]);
  columns = input<{
    field: string;
    header: string;
    sortable?: boolean;
    type?: 'text' | 'date' | 'currency' | 'number' | 'boolean';
    pipe?: PipeTransform;
    width?: string;
    align?: 'left' | 'center' | 'right';
    format?: (value: any) => string;
    actions?: {
      icon: string;
      label?: string;
      class?: string;
      onClick: (row: T) => void;
    }[];
    template?: TemplateRef<any>;
  }[]>([]);

  globalFilterFields = input<string[]>([]);
  paginator = input<boolean>(true);
  rows = input<number>(10);
  loading = input<boolean>(false);
  emptyMessage = input<string>('Ainda não existem registos para mostrar.');
  searchPlaceholder = input<string>('Pesquisar...');
  showSearch = input<boolean>(true);

  // Output do clique na linha.
  rowClick = output<T>();

  // Controla se a tabela mostra checkbox de seleção.
  showCheckbox = input<boolean>(false);

  // Linhas selecionadas (quando showCheckbox = true).
  selection = signal<T[]>([]);

  // Emite seleção para o componente pai.
  selectionChange = output<T[]>();

  @ViewChild('dt') dt!: Table;

  // Content projection templates vindos do componente pai.
  @ContentChild('headerTemplate') headerTemplate?: TemplateRef<any>;
  @ContentChild('footerTemplate') footerTemplate?: TemplateRef<any>;
  @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;

  /**
   * Filtro global da tabela.
   */
  onGlobalFilter(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(query, 'contains');
  }

  /**
   * Limpa todos os filtros aplicados.
   */
  clearFilters() {
    this.dt.clear();
  }

  /**
   * Trata o clique na seleção sem disparar a edição ao clicar na checkbox.
   */
  onSelectRow(event: any) {
    const originalEvent: Event | undefined = event.originalEvent;

    if (originalEvent) {
      const target = originalEvent.target as HTMLElement;
      const clickedOnCheckbox =
        target.closest('p-tablecheckbox') ||
        target.closest('.p-checkbox') ||
        target.closest('input[type="checkbox"]');

      if (clickedOnCheckbox) {
        return;
      }
    }

    if (event.data) {
      this.rowClick.emit(event.data);
    }
  }

  /**
   * Resolve campos aninhados como "category.name".
   */
  getFieldValue(row: any, field: string): any {
    if (!row || !field) return '';
    return field.split('.').reduce((acc, part) => acc?.[part], row);
  }

  /**
   * Aplica formatação automática às células.
   */
  formatCell(value: any, col: any): string {
    if (col.format) return col.format(value);

    switch (col.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('pt-PT') : '';
      case 'currency':
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
      case 'boolean':
        return value ? 'Sim' : 'Não';
      case 'number':
        return value?.toString() ?? '';
      default:
        return value ?? '';
    }
  }

  /**
   * Atualiza a seleção atual e notifica o componente pai.
   */
  onSelectionChange(event: any) {
    if (!this.showCheckbox()) return;

    this.selection.set(event);
    this.selectionChange.emit(event);
  }
}
