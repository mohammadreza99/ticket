import {
  AfterContentInit,
  ChangeDetectorRef,
  Component, ContentChildren,
  EventEmitter,
  InjectFlags,
  Injector,
  Input,
  OnInit,
  Output, QueryList,
  TemplateRef
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
  selector: 'ng-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutoCompleteComponent,
      multi: true,
    },
  ],
})
export class AutoCompleteComponent implements OnInit, ControlValueAccessor, AfterContentInit {
  @Input() value: any;
  @Input() label: string;
  @Input() filled: boolean = false;
  @Input() labelWidth: number;
  @Input() hint: string;
  @Input() rtl: boolean = false;
  @Input() showRequiredStar: boolean = true;
  @Input() icon: string;
  @Input() labelPos: NgLabelPosition = 'fix-top';
  @Input() iconPos: NgPosition = 'left';
  @Input() addon: {
    before?: NgAddonConfig;
    after?: NgAddonConfig;
  };
  @Input() errors: NgError;
  // native properties
  @Input() suggestions: any[];
  @Input() field: string;
  @Input() scrollHeight: string = '200px';
  @Input() dropdown: boolean = false;
  @Input() multiple: boolean = false;
  @Input() dropdownIcon: string = 'pi pi-chevron-down';
  @Input() minlength: number = 1;
  @Input() completeOnFocus: boolean = false;
  @Input() style: any;
  @Input() inputStyle: any;
  @Input() panelStyle: any;
  @Input() styleClass: string;
  @Input() inputStyleClass: string;
  @Input() panelStyleClass: string;
  @Input() optionGroupLabel: string = 'label';
  @Input() group: boolean = false;
  @Input() optionGroupChildren: any[];
  @Input() placeholder: string;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxlength: number;
  @Input() size: number;
  @Input() appendTo: any;
  @Input() tabIndex: any;
  @Input() inputSize: NgSize = 'md';
  @Input() dataKey: string;
  @Input() autoHighlight: boolean = false;
  @Input() type: string = 'text';
  @Input() showEmptyMessage: boolean = false;
  @Input() emptyMessage: string = 'No records found.';
  @Input() autofocus: boolean = false;
  @Input() forceSelection: boolean = true;
  @Input() dropdownMode: 'blank' | 'current' = 'blank';
  @Input() baseZIndex: number = 1000;
  @Input() autoZIndex: boolean = true;
  @Input() showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';
  @Input() hideTransitionOptions: string = '.1s linear';
  @Input() ariaLabel: string;
  @Input() ariaLabelledBy: string;
  @Input() dropdownAriaLabel: string;
  @Input() unique: boolean = true;
  @Input() autocomplete: string;
  @Input() virtualScroll: boolean = false;
  @Input() itemSize: number;
  @Output() completeMethod = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onKeyUp = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  @Output() onUnselect = new EventEmitter();
  @Output() onDropdownClick = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() onShow = new EventEmitter();
  @Output() onHide = new EventEmitter();
  @Output() onBeforeBtnClick = new EventEmitter();
  @Output() onAfterBtnClick = new EventEmitter();
  @ContentChildren(TemplateDirective) templates: QueryList<TemplateDirective>;

  inputId: string;
  controlContainer: FormGroupDirective;
  ngControl: NgControl;
  itemTemplate: TemplateRef<any>;
  emptyTemplate: TemplateRef<any>;
  groupTemplate: TemplateRef<any>;
  selectedItemTemplate: TemplateRef<any>;
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
        case 'item':
          this.itemTemplate = item.templateRef;
          break;

        case 'group':
          this.groupTemplate = item.templateRef;
          break;

        case 'selectedItem':
          this.selectedItemTemplate = item.templateRef;
          break;

        case 'header':
          this.headerTemplate = item.templateRef;
          break;

        case 'empty':
          this.emptyTemplate = item.templateRef;
          break;

        case 'footer':
          this.footerTemplate = item.templateRef;
          break;

        default:
          this.itemTemplate = item.templateRef;
          break;
      }
    });
  }

  _completeMethod(event) {
    this.completeMethod.emit(event);
  }

  _onBlur() {
    this.onBlur.emit();
    this.onModelTouched();
  }

  _onKeyUp(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    this.onKeyUp.emit(event);
    if (!this.forceSelection) {
      this.onModelChange(inputElement.value);
    }
  }

  _onSelect(event) {
    this.onSelect.emit(event);
    this.onModelChange(this.value);
  }

  _onUnselect(event) {
    this.onUnselect.emit(event);
    this.onModelChange(this.value);
  }

  _onDropdownClick(event) {
    this.onDropdownClick.emit(event);
  }

  _onClear(event: InputEvent) {
    const inputElement = event.target as HTMLInputElement;
    this.onClear.emit(event);
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

