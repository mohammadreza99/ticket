import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {NgPosition, NgSelectionMode, NgSize} from '@ng/models/offset';
import {NgColDef} from '@ng/models/table';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import {MenuItem, SortMeta} from 'primeng/api';
import {Table} from 'primeng/table';
import {NgTableAction} from '../../models/table';

@Component({
  selector: 'ng-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnChanges {
  @Input() emptyMessage: string = 'موردی وجود ندارد';
  @Input() header: string;
  @Input() stickyTopOffset: string;
  @Input() actions: NgTableAction[];
  @Input() exportCsvBtn: boolean = false;
  @Input() exportExcelBtn: boolean = false;
  @Input() exportPdfBtn: boolean = false;
  @Input() exportSelectionBtn: boolean = false;
  @Input() resetBtn: boolean = false;
  @Input() globalFilterPlaceholder: string = 'جستجو کنید...';
  @Input() actionsColumnHeader: string = 'عملیات';
  @Input() rtl: boolean = false;
  @Input() striped: boolean = true;
  @Input() gridlines: boolean = true;
  @Input() size: NgSize = 'sm';
  @Input() items: any[];
  @Input() colDef: NgColDef[];
  @Input() rows: number = 5000;
  @Input() dataKey: string;
  @Input() globalFilterFields: string[];
  @Input() loading: boolean = false;
  @Input() rowHover: boolean = false;
  @Input() autoLayout: boolean = false;
  @Input() responsive: boolean = true;
  @Input() reorderableRows: boolean = false;
  @Input() selectableRows: boolean = false;
  @Input() selection: any;
  @Input() selectionMode: NgSelectionMode;
  @Input() compareSelectionBy: 'equals' | 'deepEquals' = 'deepEquals';
  @Input() contextMenuItems: MenuItem[];
  @Input() contextMenuSelection: any;
  @Input() contextMenuSelectionMode: 'separate' | 'joint' = 'separate';
  @Input() reorderableColumns: boolean = false;
  @Input() resizableColumns: boolean = false;
  @Input() columnResizeMode: 'fit' | 'expand' = 'expand';
  @Input() scrollable: boolean = false;
  @Input() scrollHeight: string;
  @Input() stateStorage: 'session' | 'local';
  @Input() stateKey: string;
  @Input() filterDelay: number = 0;
  @Input() rowTrackBy: any;
  @Input() sortMode: NgSelectionMode = 'single';
  @Input() defaultSortOrder: number = 1;
  @Input() resetPageOnSort: boolean = true;
  @Input() multiSortMeta: SortMeta[];
  @Input() sortOrder: number = 1;
  @Input() sortField: string;
  @Input() exportFilename: string = 'download';
  @Input() csvSeparator: string = ',';
  @Input() paginator: boolean = true;
  @Input() first: number = 0;
  @Input() alwaysShowPaginator: boolean = false;
  @Input() paginatorPosition: NgPosition = 'bottom';
  @Input() showPageLinks: boolean = true;
  @Input() showJumpToPageDropdown: boolean = true;
  @Input() pageLinks: number = 0;
  @Input() showFirstLastIcon: boolean = true;
  @Input() totalRecords: number = 0;
  @Input() paginatorDropdownAppendTo: any = 'body';
  @Input() currentPageReportTemplate: string =
    '{first}-{last} of {totalRecords}';
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];
  @Output() onFileButtonClick = new EventEmitter();
  @Output() contextMenuSelectionChange = new EventEmitter();
  @Output() onContextMenuSelect = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Output() onRowSelect = new EventEmitter();
  @Output() onRowUnselect = new EventEmitter();
  @Output() onPage = new EventEmitter();
  @Output() onSort = new EventEmitter();
  @Output() onFilter = new EventEmitter();
  @Output() onColResize = new EventEmitter();
  @Output() onColReorder = new EventEmitter();
  @Output() onRowReorder = new EventEmitter();
  @Output() onEditInit = new EventEmitter();
  @Output() onEditComplete = new EventEmitter();
  @Output() onEditCancel = new EventEmitter();
  @Output() onHeaderCheckboxToggle = new EventEmitter();
  @Output() onStateSave = new EventEmitter();
  @Output() onStateRestore = new EventEmitter();
  @Output() onActionClick = new EventEmitter();
  @ViewChild('dt') table: Table;

  get hasCaption() {
    return (
      this.header ||
      this.globalFilterFields ||
      this.exportCsvBtn ||
      this.exportExcelBtn ||
      this.exportPdfBtn ||
      this.exportSelectionBtn ||
      this.resetBtn
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.items = changes.items.currentValue;
    }
  }

  onSelectionChange(event) {
    this.selection = event;
    this.selectionChange.emit(this.selection);
  }

  onContextMenuSelectionChange(event) {
    this.contextMenuSelection = event;
    this.contextMenuSelectionChange.emit(this.contextMenuSelection);
  }

  _onRowSelect(event) {
    this.onRowSelect.emit(event);
  }

  _onRowUnselect(event) {
    this.onRowUnselect.emit(event);
  }

  _onPage(event) {
    this.onPage.emit(event);
  }

  _onSort(event) {
    this.onSort.emit(event);
  }

  _onFilter(event) {
    this.onFilter.emit(event);
  }

  _onContextMenuSelect(event) {
    this.onContextMenuSelect.emit(event);
  }

  _onColResize(event) {
    this.onColResize.emit(event);
  }

  _onColReorder(event) {
    this.onColReorder.emit(event);
  }

  _onRowReorder(event) {
    this.onRowReorder.emit(event);
  }

  _onEditInit(event) {
    this.onEditInit.emit(event);
  }

  _onEditComplete(event) {
    this.onEditComplete.emit(event);
  }

  _onEditCancel(event) {
    this.onEditCancel.emit(event);
  }

  _onHeaderCheckboxToggle(event) {
    this.onHeaderCheckboxToggle.emit(event);
  }

  _onStateSave(event) {
    this.onStateSave.emit(event);
  }

  _onStateRestore(event) {
    this.onStateRestore.emit(event);
  }

  onCellEdit(rowData: any, field: string, newValue: any) {
    this.fromObj(rowData, field, newValue);
  }

  fromObj(data: any, field: string | string[], value?: any) {
    if (data && field) {
      if (typeof field == 'string') {
        return this.fromObj(data, field.split('.'), value);
      } else if (field.length == 1 && value !== undefined) {
        return (data[field[0]] = value);
      } else if (field.length == 0) {
        return data;
      } else {
        return this.fromObj(data[field[0]], field.slice(1), value);
      }
    } else {
      return null;
    }
  }

  exportPdf() {
    const doc: any = new jsPDF();
    doc.autoTable(
      this.colDef.map((col) => ({title: col.header, dataKey: col.field})),
      this.items
    );
    doc.save('list.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.items);
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'list');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  getClass(rowData: any, item: NgTableAction): string[] {
    const result = [item.className || ''];
    for (const config of item.classConfigs) {
      result.push(config.tobe.some(
          (t) => t === this.fromObj(rowData, config.field || [])
        )
          ? config.class
          : ''
      );
    }
    return result;
  }

  fileButtonClick(rowData: any, col: NgColDef) {
    if (col.renderer.fileButtonDefaultBehavior) {
      window.open(this.fromObj(rowData, col.field));
    } else {
      this.onFileButtonClick.emit(rowData);
    }
  }
}
