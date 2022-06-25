export interface FilterConfig {
  page_number?: number;
  page_limit?: number;
  search_text?: string;
  filter?: object;
  [text:string]:any;
}
export interface ResponseConfig {
  data?: any;
  status?: string;
}
