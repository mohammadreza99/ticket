import {Component, OnInit} from '@angular/core';
import {NgConfirmOptions} from '@ng/models/overlay';

@Component({
  selector: 'ng-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  options: NgConfirmOptions = {
    rtl: false,
    closable: true,
    dismissableMask: false,
    position: 'center',
    style: {width: '400px'},
    acceptVisible: true,
    acceptLabel: 'بله',
    rejectVisible: true,
    rejectLabel: 'خیر',
    rejectAppearance: 'outlined',
    rejectColor: 'danger',
    baseZIndex: 1000,
    autoZIndex: true,
    breakpoints: {'960px': '75vw', '640px': '100vw'},
    transitionOptions: '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
  };


  constructor() {
  }

  ngOnInit() {
  }
}
