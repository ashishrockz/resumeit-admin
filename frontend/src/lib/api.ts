export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  is_premium: boolean;
  is_featured: boolean;
  usage_count: number;
  avg_ats_score: number;
  created_at: string;
  tags: string[];
}