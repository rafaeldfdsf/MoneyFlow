import { Component, signal } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { GenericTableComponent } from "@/shared/components/generic-table/generic-table";

@Component({
  selector: 'app-dashboard',
  imports: [StatsWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget, GenericTableComponent],
  template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-generic-table
      [title]="'Clientes'"
      [data]="customers()"
      [columns]="columns"
      [paginator]="true"
      [rows]="5"
      (rowClick)="onRowClick($event)"
    >
      <!-- Custom header -->
      <ng-template #headerTemplate>
        <div class="flex justify-between items-center mb-3">
          <h2>Gestão de Clientes</h2>
          <button pButton label="Adicionar Cliente" icon="pi pi-plus"></button>
        </div>
      </ng-template>

      <!-- Custom column actions -->
      <ng-template #actionsTemplate let-row>
        <button
          pButton
          icon="pi pi-pencil"
          class="p-button-text"
          (click)="edit(row)"
        ></button>
        <button
          pButton
          icon="pi pi-trash"
          class="p-button-text p-button-danger"
          (click)="remove(row)"
        ></button>
      </ng-template>
    </app-generic-table>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard {
  customers = signal([
    { name: 'João', country: 'Brasil', status: 'Ativo' },
    { name: 'Maria', country: 'Portugal', status: 'Inativo' },
  ]);

  columns = [
    { field: 'name', header: 'Nome', sortable: true },
    { field: 'country', header: 'País', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'actions', header: 'Ações' },
  ];

  onRowClick(row: any) {
    alert(`Cliente selecionado: ${row.name}`);
  }

  edit(row: any) {
    console.log('Editar:', row);
  }

  remove(row: any) {
    console.log('Remover:', row);
  }
}
