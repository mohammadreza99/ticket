import {
  AfterContentInit,
  ChangeDetectorRef,
  Component, ContentChildren,
  EventEmitter,
  forwardRef,
  InjectFlags,
  Injector,
  Input,
  OnInit,
  Output, QueryList, TemplateRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
} from '@angular/forms';
import {NgAddonConfig, NgError, NgLabelPosition} from '@ng/models/forms';
import {NgPosition, NgSize} from '@ng/models/offset';
import {TemplateDirective} from '@ng/directives/template.directive';

@Component({
  selector: 'ng-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements OnInit, ControlValueAccessor, AfterContentInit {
  @Input() value: any;
  @Input() label: string;
  @Input() filled: boolean = false;
  @Input() labelWidth: number;
  @Input() hint: string;
  @Input() rtl: boolean = false;
  @Input() showRequiredStar: boolean = true;
  @Input() disabled: boolean = false;
  @Input() labelPos: NgLabelPosition = 'float';
  @Input() iconPos: NgPosition = 'left';
  @Input() errors: NgError;
  @Input() icon: string;
  @Input() inputSize: NgSize = 'md';
  @Input() addon: {
    before?: NgAddonConfig;
    after?: NgAddonConfig;
  };
  // native properties
  @Input() promptLabel: string = 'لطفا رمز عبور را وارد کنید';
  @Input() mediumRegex: string = '/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})./';
  @Input() strongRegex: string = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/';
  @Input() weakLabel: string = 'ضعیف';
  @Input() mediumLabel: string = 'متوسط';
  @Input() strongLabel: string = 'قوی';
  @Input() feedback: boolean = true;
  @Input() toggleMask: boolean = false;
  @Input() appendTo: any;
  @Input() inputStyle: any;
  @Input() inputStyleClass: string;
  @Input() style: any;
  @Input() styleClass: string;
  @Input() placeholder: string;
  @Output() onInput = new EventEmitter();
  @Output() onChange = new EventEmitter();
  @Output() onKeydown = new EventEmitter();
  @Output() onKeyup = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() onBeforeBtnClick = new EventEmitter();
  @Output() onAfterBtnClick = new EventEmitter();
  @ContentChildren(TemplateDirective) templates: QueryList<TemplateDirective>;

  inputId: string;
  controlContainer: FormGroupDirective;
  ngControl: NgControl;
  contentTemplate: TemplateRef<any>;
  headerTemplate: TemplateRef<any>;
  footerTemplate: TemplateRef<any>;

  constructor(private cd: ChangeDetectorRef, private injector: Injector) {
  }

  onModelChange: any = (_: any) => {
  };

  onModelTouched: any = () => {
  };

  ngOnInit() {
    let parentForm: FormGroup;
    let rootForm: FormGroupDirective;
    let currentControl: AbstractControl;
    this.inputId = this.getId();
    this.controlContainer = this.injector.get(
      ControlContainer,
      null,
      InjectFlags.Optional || InjectFlags.Host || InjectFlags.SkipSelf
    ) as FormGroupDirective;
    this.ngControl = this.injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    if (this.controlContainer && this.ngControl) {
      parentForm = this.controlContainer.control;
      rootForm = this.controlContainer.formDirective as FormGroupDirective;
      if (this.ngControl instanceof NgModel) {
        currentControl = this.ngControl.control;
      } else if (this.ngControl instanceof FormControlName) {
        currentControl = parentForm.get(this.ngControl.name.toString());
      }
      rootForm.ngSubmit.subscribe(() => {
        if (!this.disabled) {
          currentControl.markAsTouched();
        }
      });
      if (this.showRequiredStar) {
        if (this.isRequired(currentControl)) {
          if (this.label) {
            this.label += ' *';
          }
          if (this.placeholder) {
            this.placeholder += ' *';
          }
        }
      }
    }
  }

  ngAfterContentInit() {
    this.templates.forEach((item: TemplateDirective) => {
      switch (item.getType()) {
        case 'content':
          this.contentTemplate = item.templateRef;
          break;

        case 'header':
          this.headerTemplate = item.templateRef;
          break;

        case 'footer':
          this.footerTemplate = item.templateRef;
          break;

        default:
          this.contentTemplate = item.templateRef;
          break;
      }
    });
  }

  _onChange(event: Event) {
    /* onchange occurs when the selection, the checked state or the contents of an element have changed. In some cases, it only occurs when the element loses the focus. The onchange attribute can be used with <input>, <select>, and <textarea> */
    const inputElement = event.target as HTMLInputElement;
    this.onChange.emit(event);
    this.onModelChange(inputElement.value);
  }

  _onInput(event: Event) {
    /* oninput event occurs when the text content of an element is changed through the user interface */
    const inputElement = event.target as HTMLInputElement;
    this.onInput.emit(event);
    this.onModelChange(inputElement.value);
  }

  _onBlur() {
    this.onBlur.emit();
    this.onModelTouched();
  }

  _onKeydown(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    this.onKeydown.emit(event);
    this.onModelChange(inputElement.value);
  }

  _onKeyup(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    this.onKeyup.emit(event);
    this.onModelChange(inputElement.value);
  }

  emitter(name: string, event: any) {
    (this[name] as EventEmitter<any>).emit(event);
  }

  getId() {
    return Math.random().toString(36).substr(2, 9);
  }

  isInvalid() {
    if (this.ngControl) {
      const control = this.ngControl.control;
      return (control.touched || control.dirty) && control.invalid;
    }
  }

  showError(errorType: string): boolean {
    return (
      this.isInvalid() && this.ngControl.control.hasError(errorType.toLowerCase())
    );
  }


  isRequired(control: AbstractControl): boolean {
    let isRequired = false;
    const formControl = new FormControl();
    for (const key in control) {
      if (Object.prototype.hasOwnProperty.call(control, key)) {
        formControl[key] = control[key];
      }
    }
    formControl.setValue(null);
    if (formControl.errors?.required) {
      isRequired = true;
    }
    return isRequired;
  }

  writeValue(value: any) {
    this.value = value;
    this.cd.markForCheck();
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean) {
    this.disabled = val;
    this.cd.markForCheck();
  }
}
