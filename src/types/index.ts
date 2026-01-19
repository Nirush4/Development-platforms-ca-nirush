// types.ts
export interface Author {
  avatar_url?: string;
  id: string;
  username: string;
  email: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  category: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url?: string;
}

export interface ArticleFromDB {
  id: string;
  title: string;
  body: string;
  category: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  profiles: Author | null;
}
