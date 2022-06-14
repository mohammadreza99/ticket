export interface FAQ {
  faq_id: number,
  title: string,
  question_text: string,
  answer_text: string,
  is_published: boolean,
  category: FAQCategoryAbs,
  priority: string
}

export interface FAQCategoryAbs {
  category_id: number;
  title: string
}
