import {NgColor} from "@ng/models/color";

class ColDefFilter {
  type?: string;
  field?: string;
  placeholder?: string;
  optionLabel?: string;
  optionValue?: string;
  options?: any[];
}

interface ColDef {
  header: string;
  field?: string;
  subField?: string;
  type?: string;
  filterOption?: ColDefFilter;
  sortabled?: boolean;
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  templateString?: (item) => any
}

export interface ActionConfig {
  header: string;
  field?: string;
  icon?: string;
  color?: any | NgColor;
  routerLink?: string;
  routerLinkParam?: string;
}

export interface TableConfig {
  colDef?: ColDef[];
  actionConfig?: ActionConfig[];
  total?: number;
  onColActionClick?: (data: any) => Promise<any> | void;
  onHeaderActionClick?: (data: any) => Promise<any> | void;
  onSearch?: (value: string) => Promise<any> | void;
  onReload?: () => Promise<any> | void;
  onDownload?: () => Promise<any> | void;
  onAdd?: () => Promise<any> | void;
  onFilter?: (data: any) => Promise<any> | void;
  onSort?: (data: any) => Promise<any> | void;
  onFetch?: (data: any) => Promise<any> | void;
}
