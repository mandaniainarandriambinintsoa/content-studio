export type Platform = "tiktok" | "instagram" | "youtube_shorts" | "linkedin";

export type ScriptStatus =
  | "idea"
  | "draft"
  | "ready"
  | "recorded"
  | "published"
  | "archived";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Script {
  id: string;
  project_id: string | null;
  title: string;
  hook: string | null;
  body: string;
  cta: string | null;
  duration_seconds: number | null;
  audio_url: string | null;
  video_url: string | null;
  status: ScriptStatus;
  created_at: string;
  updated_at: string;
}

export interface PlatformPost {
  id: string;
  script_id: string;
  platform: Platform;
  caption: string | null;
  hashtags: string[] | null;
  scheduled_at: string | null;
  published_at: string | null;
  external_url: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
}
