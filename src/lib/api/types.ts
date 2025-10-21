/**
 * Type definitions for API responses and data structures.
 */

/**
 * Video file information from Pexels API
 */
export interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

/**
 * Video picture information from Pexels API
 */
export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

/**
 * Video information from Pexels API
 */
export interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  full_res: string | null;
  tags: string[];
  url: string;
  image: string;
  avg_color: string | null;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
  category?: string;
  displayTitle?: string;
}

/**
 * Pagination information from Pexels API
 */
export interface Pagination {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
}

/**
 * Response from Pexels videos API
 */
export interface VideosResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: Video[];
}

/**
 * Video category information
 */
export interface VideoCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

/**
 * Categories response from API
 */
export interface CategoriesResponse {
  categories: VideoCategory[];
}

/**
 * Error response from API
 */
export interface ApiError {
  message: string;
}
