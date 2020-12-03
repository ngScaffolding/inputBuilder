import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { InputBuilderDefinition } from '@ngscaffolding/models';

@Component({
    selector: 'ngs-input-builder-popup',
    templateUrl: 'inputBuilderPopup.component.html',
    styleUrls: ['inputBuilderPopup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputBuilderPopupComponent implements OnDestroy {
    @Input() inputBuilderDefinition: InputBuilderDefinition;
    @Input() attachMouseClick: boolean;
    @Input() inputModel: any;
    @Input() setWidth: number;
    @Input() setTop: number;
    @Input() setLeft: number;

    @Output() modelUpdated = new EventEmitter<any>();
    @Output() valueUpdated = new EventEmitter<[string, any]>();

    @Output() okClicked = new EventEmitter<any>();
    @Output() cancelClicked = new EventEmitter<any>();

    isShown: boolean;

    private mouseSubscription: Subscription;
    private mouseX: number;
    private mouseY: number;
    private screenWidth: number;

    constructor(private changeDetector: ChangeDetectorRef) {
        this.mouseSubscription = fromEvent(document.body, 'mousemove').subscribe(e => {
            if (this.attachMouseClick) {
                this.screenWidth = window.innerWidth;
                this.mouseY = e['pageY'];
                this.mouseX = e['pageX'];
                if (this.setWidth) {
                    if (this.mouseX + this.setWidth > this.screenWidth) {
                        this.setLeft = this.mouseX - this.setWidth;
                    } else {
                        this.setLeft = this.mouseX;
                    }
                    this.setTop = this.mouseY;
                } else {
                    this.setLeft = this.mouseX;
                    this.setTop = this.mouseY;
                }

                if (!this.isShown) {
                    const newStyle: any = { overflow: 'visible', position: 'absolute' };

                    newStyle.top = `${this.setTop}px`;
                    newStyle.left = `${this.setLeft}px`;

                    this.styleValues = newStyle;

                    this.changeDetector.detectChanges();
                }
            }
        });
    }

    styleValues = {
        overflow: 'visible'
    };

    showPopup() {
        this.isShown = true;
        this.changeDetector.markForCheck();
    }

    ngOnDestroy(): void {
        if (this.mouseSubscription) {
            this.mouseSubscription.unsubscribe();
        }
    }

    notifyChanged(event: any) {}

    onModelUpdated(model: any) {
        this.modelUpdated.emit(model);
    }

    onValueUpdated() {}

    onOkClicked(model: any) {
        this.okClicked.emit(model);
    }
    onCancelClicked() {
        this.cancelClicked.emit(null);
        this.isShown = false;
        this.changeDetector.markForCheck();
    }
}
