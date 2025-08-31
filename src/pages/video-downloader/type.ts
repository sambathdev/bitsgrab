export interface IVideo {
  title: string;
  video_id: string;

  comment_count?: number;
  like_count?: number;
  cover?: string;
  images?: any[]
  play?: string;
  play_count?: number;
  size?: number;
  status?: any;
  platform?: any;
  username?: string;
  progress_size?: string;
}