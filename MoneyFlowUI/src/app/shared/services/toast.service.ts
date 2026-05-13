import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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

    error(message: unknown, summary = 'Erro') {
        this.messageService.add({
            severity: 'error',
            summary,
            detail: this.normalizeMessage(message)
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

    private normalizeMessage(message: unknown): string {
        if (typeof message === 'string') {
            return message;
        }

        if (message instanceof Error) {
            return message.message;
        }

        if (message instanceof HttpErrorResponse) {
            const error = message.error;

            if (typeof error === 'string' && error.trim()) {
                return error;
            }

            if (error?.message) {
                return error.message;
            }

            if (error?.title) {
                return error.title;
            }

            return message.message || 'O pedido falhou.';
        }

        if (message && typeof message === 'object' && 'message' in message) {
            const candidate = (message as { message?: unknown }).message;
            if (typeof candidate === 'string' && candidate.trim()) {
                return candidate;
            }
        }

        return 'O pedido falhou.';
    }
}
