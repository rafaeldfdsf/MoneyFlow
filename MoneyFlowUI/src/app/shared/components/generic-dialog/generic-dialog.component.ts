import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-generic-dialog',
    standalone: true,
    imports: [
        DialogModule,
        NgTemplateOutlet
    ],
    templateUrl: './generic-dialog.component.html'
})
export class GenericDialogComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() header = 'Dialog';
    @Input() width = '450px';

    @Input() content!: TemplateRef<any>;
    @Input() footer!: TemplateRef<any>;
}
