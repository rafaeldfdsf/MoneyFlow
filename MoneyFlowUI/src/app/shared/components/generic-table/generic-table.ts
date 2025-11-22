import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, input, Input, output, Output, PipeTransform, signal, TemplateRef, ViewChild } from '@angular/core';
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
  // 🧠 Inputs reativos
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

  // ⚡ Output
  rowClick = output<T>();

  @ViewChild('dt') dt!: Table;

  // 🧱 Content projection templates (do pai)
  @ContentChild('headerTemplate') headerTemplate?: TemplateRef<any>;
  @ContentChild('footerTemplate') footerTemplate?: TemplateRef<any>;
  @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;

  /** Filtro global */
  onGlobalFilter(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(query, 'contains');
  }

  clearFilters() {
    this.dt.clear();
  }

  onSelectRow(event: any) {
    const data = Array.isArray(event.data) ? event.data[0] : event.data;
    if (data) this.rowClick.emit(data);
  }

  getFieldValue(row: any, field: string): any {
    if (!row || !field) return '';
    return field.split('.').reduce((acc, part) => acc?.[part], row);
  }

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
}