import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {

    constructor(private messageService: MessageService) { }

    success(message: string, summary = 'Sucesso') {
        this.messageService.add({
            severity: 'success',
            summary,
            detail: message
        });
    }

    error(message: string, summary = 'Erro') {
        this.messageService.add({
            severity: 'error',
            summary,
            detail: message
        });
    }

    info(message: string, summary = 'Info') {
        this.messageService.add({
            severity: 'info',
            summary,
            detail: message
        });
    }

    warn(message: string, summary = 'Aviso') {
        this.messageService.add({
            severity: 'warn',
            summary,
            detail: message
        });
    }
}