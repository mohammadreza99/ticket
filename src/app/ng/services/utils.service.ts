import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type,
  ViewContainerRef
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ConfirmPopupComponent} from '@ng/components/confirm-popup/confirm-popup.component';
import {ConfirmComponent} from '@ng/components/confirm/confirm.component';
import {DialogFormComponent} from '@ng/components/dialog-form/dialog-form.component';
import {MessageComponent} from '@ng/components/message/message.component';
import {ToastComponent} from '@ng/components/toast/toast.component';
import {
  NgConfirmOptions,
  NgConfirmPopupOptions,
  NgDialog,
  NgDialogFormConfig,
  NgDialogFormOptions,
  NgMessage,
  NgMessageOptions,
  NgToastOptions
} from '@ng/models/overlay';
import {ConfirmationService, FilterService, MessageService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {fromEvent, merge, Observable, Observer} from 'rxjs';
import {map} from 'rxjs/operators';
import {NumberToPersianWord} from './num-to-per-word';
import {DialogComponent} from '@ng/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private messageCmpRef: ComponentRef<MessageComponent>;
  private toastCmpRef: ComponentRef<ToastComponent>;
  private confirmPopupCmpRef: ComponentRef<ConfirmPopupComponent>;
  private confirmCmpRef: ComponentRef<ConfirmComponent>;
  private dialogCmpRef: ComponentRef<DialogComponent>;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private resolver: ComponentFactoryResolver,
    private filterService: FilterService,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {
  }

  //////////////////////////////////////////////////////////////////////////
  //                              MESSAGE                                 //
  //////////////////////////////////////////////////////////////////////////
  showMessage(options: NgMessageOptions): void {
    if (!document.body.contains((this.messageCmpRef?.hostView as EmbeddedViewRef<any>)?.rootNodes[0])) {
      this.messageCmpRef = this.addComponentToBody(MessageComponent, 'prepend');
    }
    Object.assign(this.messageCmpRef.instance.options, options);
    setTimeout(() => {
      this.messageService.add({
        severity: options.severity,
        summary: options.summary,
        detail: options.detail,
        key: options.key,
        closable: options.closable,
        styleClass: options.styleClass,
      });
    }, 0);
  }

  //////////////////////////////////////////////////////////////////////////
  //                                TOAST                                 //
  //////////////////////////////////////////////////////////////////////////
  showToast(options: NgToastOptions): void {
    if (!document.body.contains((this.toastCmpRef?.hostView as EmbeddedViewRef<any>)?.rootNodes[0])) {
      this.toastCmpRef = this.addComponentToBody(ToastComponent);
    }
    Object.assign(this.toastCmpRef.instance.options, options);
    setTimeout(() => {
      this.messageService.add({
        severity: options.severity,
        summary: options.summary,
        detail: options.detail,
        id: options.id,
        key: options.key,
        life: options.life,
        sticky: options.sticky,
        closable: options.closable,
        data: options.data,
        styleClass: options.styleClass,
        contentStyleClass: options.contentStyleClass,
      });
    }, 0);
  }

  //////////////////////////////////////////////////////////////////////////
  //                           CONFIRM POPUP                              //
  //////////////////////////////////////////////////////////////////////////
  showConfirmPopup(options: NgConfirmPopupOptions): Promise<boolean> {
    if (!document.body.contains((this.confirmPopupCmpRef?.hostView as EmbeddedViewRef<any>)?.rootNodes[0])) {
      this.confirmPopupCmpRef = this.addComponentToBody(ConfirmPopupComponent);
    }
    Object.assign(this.confirmPopupCmpRef.instance.options, options);
    return new Promise((accept, reject) => {
      this.confirmationService.confirm({
        target: options.target,
        message: options.message,
        icon: options.icon,
        accept: () => {
          this.removeComponentFromBody(this.confirmPopupCmpRef);
          accept(true);
        },
        reject: () => {
          this.removeComponentFromBody(this.confirmPopupCmpRef);
          accept(false);
        },
        key: options.key,
        acceptLabel: options.acceptLabel,
        rejectLabel: options.rejectLabel,
        acceptIcon: options.acceptIcon,
        rejectIcon: options.rejectIcon,
        acceptVisible: options.acceptVisible,
        rejectVisible: options.rejectVisible,
        acceptButtonStyleClass: options.acceptButtonStyleClass,
        rejectButtonStyleClass: options.rejectButtonStyleClass,
        defaultFocus: options.defaultFocus,
      });
    });
  }

  showConfirm(options: NgConfirmOptions): Promise<boolean> {
    if (!document.body.contains((this.confirmCmpRef?.hostView as EmbeddedViewRef<any>)?.rootNodes[0])) {
      this.confirmCmpRef = this.addComponentToBody(ConfirmComponent);
    }
    Object.assign(this.confirmCmpRef.instance.options, options);
    return new Promise((accept, reject) => {
      this.confirmationService.confirm({
        key: options.key,
        header: options.header,
        message: options.message,
        icon: options.icon,
        blockScroll: options.blockScroll,
        accept: () => {
          this.removeComponentFromBody(this.confirmCmpRef);
          accept(true);
        },
        reject: (data) => {
          this.removeComponentFromBody(this.confirmCmpRef);
          if (data == 2) {
            accept(null);
          } else if (data == 1) {
            accept(false);
          }
        },
        dismissableMask: options.dismissableMask,
        closeOnEscape: options.closeOnEscape,
      });
    });
  }

  //////////////////////////////////////////////////////////////////////////
  //                              DIALOG                                  //
  //////////////////////////////////////////////////////////////////////////
  showDialog(options: NgDialog): Promise<void> {
    if (!document.body.contains((this.dialogCmpRef?.hostView as EmbeddedViewRef<any>)?.rootNodes[0])) {
      this.dialogCmpRef = this.addComponentToBody(DialogComponent);
    }
    Object.assign(this.dialogCmpRef.instance.options, options);
    this.dialogCmpRef.instance.visible = true;
    return new Promise((accept, reject) => {
      this.dialogCmpRef.instance.onHide.subscribe(res => {
        this.removeComponentFromBody(this.dialogCmpRef);
        accept();
      });
    });
  }

  showDialogForm(
    header: string,
    config: NgDialogFormConfig[],
    options?: NgDialogFormOptions
  ): DynamicDialogRef {
    return this.dialogService.open(DialogFormComponent, {
      header,
      data: {config, options},
      width: options?.width || '550px',
      styleClass: options?.rtl ? 'rtl' : 'ltr',
      footer: options?.footer,
      height: options?.height,
      closeOnEscape: options?.closeOnEscape,
      dismissableMask: options?.dismissableMask,
      closable: options?.closable || true,
      showHeader: options?.showHeader || true,
      baseZIndex: 1000
    });
  }

  //////////////////////////////////////////////////////////////////////////
  //                               FILTER                                 //
  //////////////////////////////////////////////////////////////////////////
  startsWith(value: any, filter: any) {
    return this.filterService.filters.startsWith(value, filter);
  }

  contains(value: any, filter: any) {
    return this.filterService.filters.contains(value, filter);
  }

  endsWith(value: any, filter: any) {
    return this.filterService.filters.endsWith(value, filter);
  }

  equals(value: any, filter: any) {
    return this.filterService.filters.equals(value, filter);
  }

  notEquals(value: any, filter: any) {
    return this.filterService.filters.notEquals(value, filter);
  }

  in(value: any, filter: any) {
    return this.filterService.filters.in(value, filter);
  }

  lt(value: any, filter: any) {
    return this.filterService.filters.lt(value, filter);
  }

  lte(value: any, filter: any) {
    return this.filterService.filters.lte(value, filter);
  }

  gt(value: any, filter: any) {
    return this.filterService.filters.gt(value, filter);
  }

  gte(value: any, filter: any) {
    return this.filterService.filters.gte(value, filter);
  }

  is(value: any, filter: any) {
    return this.filterService.filters.is(value, filter);
  }

  isNot(value: any, filter: any) {
    return this.filterService.filters.isNot(value, filter);
  }

  before(value: any, filter: any) {
    return this.filterService.filters.before(value, filter);
  }

  //////////////////////////////////////////////////////////////////////////
  //                         PERSIAN-ENGLISH                              //
  //////////////////////////////////////////////////////////////////////////
  after(value: any, filter: any) {
    return this.filterService.filters.after(value, filter);
  }

  replaceArabicLettersWithPersianLetters(inputStr: string): string {
    if (inputStr == undefined) {
      return '';
    }
    inputStr = inputStr.replace(/??/g, '??');
    inputStr = inputStr.replace(/??/g, '??');
    return inputStr;
  }

  isPersianNumber(num: number | string): boolean {
    const regexp = new RegExp('^[\u06F0-\u06F9]+$');
    return regexp.test(num as string);
  }

  toPersianNumber(num: number | string): string {
    return this.arabicNumberToPersian(this.engNumberToPersian(num as string));
  }

  toEngNumber(num: string): number {
    const engNumber = +this.persianNumberToEng(num);
    if (isNaN(engNumber)) {
      throw new Error(`${num} is not valid persian Number`);
    }
    return engNumber;
  }

  toPersianWord(num: number | string): string {
    return new NumberToPersianWord().convertNumberToString(
      this.toEngNumber(num as string)
    );
  }

  engNumberToPersian(num: string): string {
    if (num == undefined) {
      return '';
    }
    let str = num.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/0/g, '??');
    str = str.replace(/1/g, '??');
    str = str.replace(/2/g, '??');
    str = str.replace(/3/g, '??');
    str = str.replace(/4/g, '??');
    str = str.replace(/5/g, '??');
    str = str.replace(/6/g, '??');
    str = str.replace(/7/g, '??');
    str = str.replace(/8/g, '??');
    str = str.replace(/9/g, '??');
    return str;
  }

  arabicNumberToPersian(num: string): string {
    if (num == undefined) {
      return '';
    }
    let str = num.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/??/g, '??');
    str = str.replace(/??/g, '??');
    str = str.replace(/??/g, '??');
    return str;
  }

  //////////////////////////////////////////////////////////////////////////
  //                              GENERAL                                 //
  //////////////////////////////////////////////////////////////////////////
  persianNumberToEng(num: string) {
    if (num == undefined) {
      return NaN;
    }
    let str = num.toString().trim();
    if (str === '') {
      return NaN;
    }
    str = str.replace(/??/g, '0');
    str = str.replace(/??/g, '1');
    str = str.replace(/??/g, '2');
    str = str.replace(/??/g, '3');
    str = str.replace(/??/g, '4');
    str = str.replace(/??/g, '5');
    str = str.replace(/??/g, '6');
    str = str.replace(/??/g, '7');
    str = str.replace(/??/g, '8');
    str = str.replace(/??/g, '9');
    return str;
  }

  checkConnection(): Observable<boolean> {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
    ).pipe(map(() => navigator.onLine));
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  shallowClone(obj) {
    return Object.assign({}, obj);
  }

  getDirtyControls(
    form: FormGroup,
    type: 'object' | 'array' | 'names' = 'object'
  ): {} {
    const kv = Object.entries(form.controls).filter((val) => val[1].dirty);
    const result = {
      object: () =>
        kv.reduce(
          (accum, val) => Object.assign(accum, {[val[0]]: val[1].value}),
          {}
        ),
      array: () => kv.map((val) => val[1]),
      names: () => kv.map((val) => val[0])
    }[type]();
    return Object.assign(result, {id: form.get('id').value});
  }

  addComponentToBody<T>(component: Type<T>, pos: 'appendChild' | 'prepend' = 'appendChild'): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body[pos](domElem);
    return componentRef;
  }

  private removeComponentFromBody<T>(componentRef: ComponentRef<T>): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  convertToTimeFormat(duration: number) {
    const hrs = Math.floor((duration / 3600));
    const mins = Math.floor(((duration % 3600) / 60));
    const secs = Math.floor(duration % 60);
    let result = '';
    if (hrs > 0) {
      result += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    result += '' + mins + ':' + (secs < 10 ? '0' : '');
    result += '' + secs;
    return result;
  }
}
