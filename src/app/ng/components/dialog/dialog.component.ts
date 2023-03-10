import {Component, EventEmitter, OnInit, Output, ViewContainerRef} from '@angular/core';
import {NgDialog} from '@ng/models/overlay';
import {UtilsService} from '@ng/services';
import {Subject} from 'rxjs';

@Component({
  selector: 'ng-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  private _onHide = new Subject();
  onHide = this._onHide.asObservable();

  options: NgDialog = {
    draggable: true,
    keepInViewport: true,
    resizable: true,
    visible: false,
    modal: false,
    position: 'center',
    blockScroll: false,
    closeOnEscape: true,
    dismissableMask: false,
    rtl: false,
    closable: true,
    showHeader: true,
    baseZIndex: 1000,
    autoZIndex: true,
    minX: 0,
    minY: 0,
    focusOnShow: true,
    focusTrap: true,
    maximizable: false,
    breakpoints: {'960px': '75vw', '640px': '100vw'},
    transitionOptions: '150ms cubic-bezier(0, 0, 0.2, 1)',
    closeIcon: 'pi pi-times',
    minimizeIcon: 'pi pi-window-minimize',
    maximizeIcon: 'pi pi-window-maximize',
  };
  visible: boolean = false;

  onButtonClick() {
    this.visible = false;
    this._onHide.next();
  }
}
