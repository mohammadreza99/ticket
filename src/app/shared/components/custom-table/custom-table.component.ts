import {
  Component,
  ContentChild,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {ActionConfig, TableConfig} from '@core/models';
import {NgSize} from '@ng/models/offset';

@Component({
  selector: 'ng-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit {
  constructor(private el: ElementRef) {
  }

  @Input() rowData: any[];
  @Input() config: TableConfig;
  @Input() actions: ActionConfig;
  @Input() captionText: string;
  @Input() captionIcon: string;
  @Input() showCaption: boolean = true;
  @Input() enableSelection: boolean = false;
  @Input() enableSearch: boolean = false;
  @Input() enableAdd: boolean = true;
  @Input() enableReload: boolean = true;
  @Input() enableFilter: boolean = false;
  @Input() hasIndex: boolean = false;
  @Input() selection: any;
  @Input() first: number = 0;
  @Input() rows: number = 10;
  @Input() size: NgSize = 'sm';
  @Input() localPaginator: boolean = false;
  @Output() selectionChange = new EventEmitter();
  @ContentChild(TemplateRef, {read: TemplateRef}) tableBody: TemplateRef<any>;

  searchTerm: string;
  searchbarOpened = false;
  filterValues: any = {};
  pageInfo = {
    startIndex: this.first / this.rows, pageSize: this.rows
  };
  filterObj = {};
  activeRow
  rowsPerPageOptions = [10, 20, 30, 50, 100]

  ngOnInit(): void {
    this.pageInfo = {
      startIndex: this.first / this.rows, pageSize: this.rows
    };
  }

  async onSwitchChange(args , col){
    await this.config.onColActionClick({
      action: 'onSwitchChange',
      col: col,
    });
  }
  getItemName(value, col) {
    return col?.options.find((item) => item?.value == value);
  }

  async onColActionClick(action, col) {
    await this.config.onColActionClick({
      action: action,
      col: col,
    });
  }

  async sortColumn(event: any) {
    await this.config.onSort({
      order_by: event.field,
      order_type: event.order === 1 ? 'Asc' : 'Desc',
    });
  }

  async onSearch() {
    console.log(this.searchTerm);

    if (this.searchTerm) {
      await this.config.onSearch(this.searchTerm);
    }
  }

  async onActionClick(action: string) {
    if (action == 'onReload') {
      sessionStorage.clear();
      document.location.reload();
      return
    }
    if (action == 'onFilter') {
      await this.config.onFilter(this.filterObj);
      return
    }
    await this.config.onHeaderActionClick(action);
  }

  async toggleSearch() {
    const searchElement = this.el.nativeElement.querySelector(
      '.table-search'
    ) as HTMLElement;
    this.searchbarOpened = searchElement.classList.toggle('open');
    if (this.searchbarOpened) {
      searchElement.querySelector('input').focus();
    } else {
      searchElement.querySelector('input').blur();
      this.searchTerm = null;
      // await this.reloadData();
    }
  }

  async reloadData() {
    const data = await this.config.onFetch({page: 1, limit: 10});
    this.rowData = data.items;
  }

  async onPageChange(event: any) {
    this.pageInfo = {startIndex: event.page, pageSize: event.rows};
    await this.config.onFetch(this.pageInfo);
  }

  onSelectionChange(event: any) {
    this.selection = event;
    this.selectionChange.emit(this.selection);
  }

  // async filterColumn(event: any) {
  //   console.log(this.filterValues);
  //   await this.config.onFilter(event);
  // }

  async filterColumn(event, field) {
    Object.assign(this.filterObj, {
      [field]: event,
    });
    // await this.config.onFilter(this.filterObj);
  }

  onFromDateChange(event: any, field: any) {
    const value = event.dateObj;
    this.filterValues.fromDate = value;
    this.filterColumn({from: value, to: this.filterValues.toDate}, field);
    // filter(JSON.stringify({ from: value, to: this.filterValues.toDate }));
  }

  onToDateChange(event: any, field: any) {
    const value = event.dateObj;
    this.filterValues.toDate = value;
    this.filterColumn({from: this.filterValues.fromDate, to: value}, field);
    // filter(JSON.stringify({ from: this.filterValues.fromDate, to: value }));
  }

  onFromRangeChange(event: any, field: any) {
    const value = event.target.value;
    this.filterValues.fromRange = value;
    this.filterColumn({from: value, to: this.filterValues.toRange}, field);
    // filter(JSON.stringify({ from: value, to: this.filterValues.toRange }));
  }

  onToRangeChange(event: any, field: any) {
    const value = event.target.value;
    this.filterValues.toRange = value;
    this.filterColumn({from: this.filterValues.fromRange, to: value}, field);
    // filter(JSON.stringify({ from: this.filterValues.fromRange, to: value }));
  }

  onRowClick(item) {
    this.activeRow = item
  }
}
