// Update the Template interface to match the API response
export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  html_structure: string;
  css_styles: string;
  is_premium: boolean;
  is_featured: boolean;
  usage_count: number;
  avg_ats_score: number;
  created_at: string;
  tags: string[];
}