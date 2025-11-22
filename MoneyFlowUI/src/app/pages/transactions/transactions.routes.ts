import { Routes } from '@angular/router';
import { TransactionsListComponent } from './list/transactions-list/transactions-list.component';
import { TransactionFormComponent } from './form/transaction-form/transaction-form.component';

export default [
    { path: '', component: TransactionsListComponent },
    { path: 'new', component: TransactionFormComponent },
    { path: 'edit/:id', component: TransactionFormComponent },
] as Routes;