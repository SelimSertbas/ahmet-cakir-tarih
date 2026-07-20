export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  status: "draft" | "published";
  type: string;
  published_at: string | undefined;
  updated_at: string;
  author_id: string;
  created_at: string;
  views: number;
}

export interface Video {
  id: string;
  title: string;
  video_url: string;
  video_id: string;
  type: string;
  created_at: string;
  updated_at: string;
  description: string;
  thumbnail_url: string;
  status: "draft" | "published";
}

export interface Question {
  id: string;
  name: string;
  email: string;
  title: string;
  question: string;
  answer: string | null;
  status: "pending" | "answered";
  created_at: string;
  is_published: boolean;
} 