import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Dialog } from 'primeng/dialog';

@Component({
    selector: 'app-generic-dialog',
    standalone: true,
    imports: [Dialog, NgTemplateOutlet],
    templateUrl: './generic-dialog.component.html',
    styleUrl: './generic-dialog.component.scss'
})

export class GenericDialogComponent {
    /** controla a visibilidade do dialog */
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    /** título do dialog */
    @Input() header: string = '';

    /** largura (ex: '500px', '50vw') */
    @Input() width: string = '600px';

    /** altura do conteúdo (ex: '400px', '60vh', 'auto') */
    @Input() height: string = 'auto';

    /** template de conteúdo (corpo) */
    @Input() content!: TemplateRef<unknown>;

    /** template do footer (botões, etc.) */
    @Input() footerTemplate!: TemplateRef<unknown>;

    /** chamado quando o p-dialog emite (visibleChange) */
    onVisibleChange(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(value);
    }
}
