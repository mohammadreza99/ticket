export class FAQCategory {
  category_id: string;
  title: string;
  is_published: boolean;
  parent_category_id: number;
  operator_ids: number[];
  priority: string;
  operators?: { name: string, operator_id: string }[];
  parent_category?: { title: string, category_id: string }[];
}
// export class FAQCategory {
//   title: string;
//   is_published: boolean;
//   category_id: string;
//   parent_category: { title: string, category_id: string }[];
//   operators: { name: string, operator_id: string }[];
//   priority: number
// }
