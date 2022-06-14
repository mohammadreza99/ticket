import {FAQCategoryAbs} from "@modules/main/faq/faq";

export interface DefaultAnswer {
  default_answer_id: number;
  title: string;
  answer: string;
  category: FAQCategoryAbs
}
