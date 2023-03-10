import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  InjectFlags,
  Injector,
  Input,
  OnInit,
  Output
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
  NgModel
} from '@angular/forms';
import {NgAddonConfig, NgColorFormat, NgError, NgLabelPosition} from '@ng/models/forms';
import {NgPosition, NgSize} from '@ng/models/offset';

@Component({
  selector: 'ng-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
/* TODOs:
- یه نگاه به فولدربندی کامپوننت ها بنداز و وابستگی هاشونو بزار پیش خودشون .
 مثل
date-picker2 ====dependencies====>  month-text.pipe
- make components accept template

- یه دستی به سر و گوش اینپوت پسورد بکش. مدل جدید شده دیگه . قابلیت نمایش پسورد و این چیزارو داره . تست کن نریده باشه
- خیلی از کامپونت ها توی نسخه 13 نیاز نیس استایل های مربوط به فلوت لیبل و ایناش رو ما بدیم . خودش میگیره . بنابر این اگه استایل اضافه ای دادی پاکشون کن
- اینپوت سوییچ رو بهش این قابلیت رو بده که عان لیبل و عاف لیبل بگیره
- table image, boolean, shamsi-miladi date RENDERER + FILTER + EDITOR for table and grid
- implement datepickerMode for cellDatepicker for grid. (this.datePickerMode = params.datePickerMode || 'day')
- add formGroup support in dialog form config
- datepicker component has a 'moment' variable in 'select' function that conflict with 'moment' in import statement. check it!
- change showError method to flowing method (for support to show custom errors of form . not just specific errors of control) :
  showError(errorType: string): boolean {
    return (
        this.isInvalid(this.ngControl.control) &&
        this.ngControl.control.hasError(errorType.toLowerCase())
      )
      || (
        this.isInvalid((this.controlContainer.formDirective as FormGroupDirective).form) &&
        (this.controlContainer.formDirective as FormGroupDirective).form.hasError(errorType)
      );
  }
*/
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
  @Input() value: any;
  @Input() label: string;
  @Input() filled: boolean = false;
  @Input() labelWidth: number;
  @Input() hint: string;
  @Input() rtl: boolean = false;
  @Input() icon: string;
  @Input() inputSize: NgSize;
  @Input() readonly: boolean = false;
  @Input() maxlength: number = 7;
  @Input() placeholder: string;
  @Input() showRequiredStar: boolean = true;
  @Input() labelPos: NgLabelPosition = 'fix-top';
  @Input() iconPos: NgPosition = 'left';
  @Input() errors: NgError;
  @Input() addon: {
    before?: NgAddonConfig;
    after?: NgAddonConfig;
  };
  // native properties
  @Input() style: any;
  @Input() styleClass: string;
  @Input() inline: boolean = false;
  @Input() format: string = 'hex';
  @Input() appendTo: any;
  @Input() tabindex: number;
  @Input() disabled: boolean = false;
  @Input() baseZIndex: number = 1000;
  @Input() autoZIndex: boolean = true;
  @Input() showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';
  @Input() hideTransitionOptions: string = '.1s linear';
  @Output() onInput = new EventEmitter();
  @Output() onChange = new EventEmitter();
  @Output() onKeydown = new EventEmitter();
  @Output() onKeyup = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() onShow = new EventEmitter();
  @Output() onHide = new EventEmitter();

  inputId: string;
  controlContainer: FormGroupDirective;
  ngControl: NgControl;

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
          if (this.label && this.labelPos !== 'float') {
            this.label += ' *';
          }
        }
      }
    }
  }

  _onChangeColorPicker(event) {
    this.value = JSON.stringify(event.value);
    this.onChange.emit(event);
    this.onModelChange(event.value);
  }

  _onChangeInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.onChange.emit(event);
    this.onModelChange(inputElement.value);
  }

  _onInput(event: Event) {
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
