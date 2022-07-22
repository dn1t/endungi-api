interface ResultSuccess<T> {
  success: true;
  data: T;
}

interface ResultError {
  success: false;
  error: any;
}

export type Result<T> = ResultSuccess<T> | ResultError;

interface Image {
  id: string;
  name: string;
  label: {
    ko: string | null;
    en: string | null;
    ja: string | null;
    vn: string | null;
  };
  filename: string;
  imageType: string;
  dimension: { width: number | null; height: number | null };
  trimmed: {
    filename: string | null;
    width: number | null;
    height: number | null;
  };
}

interface User {
  id: string;
  nickname: string;
  username: string;
  profileImage: Image;
  description: string;
}

export interface RecommendedUser {
  id: string;
  keyword1: string | null;
  keyword2: string | null;
  keyword3: string | null;
  user: User;
}

export interface ProjectInfo {
  id: string;
  name: string;
  thumb: string;
  category:
    | '게임'
    | '생활과 도구'
    | '스토리텔링'
    | '예술'
    | '지식 공유'
    | '기타';
  created: string;
  updated: string;
  staffPicked: string;
  ranked: string;
  visits: number;
  likes: number;
  comments: number;
}

export interface UserInfo {
  id: string;
  nickname: string;
  username: string;
  description: string;
  shortUrl: string;
  profileImage: string | null;
  coverImage: string | null;
  role: 'member' | 'teacher' | 'admin';
  status: {
    study: number;
    community: any;
    following: number;
    follower: number;
    bookmark: any;
    userStatus: 'USE';
  };
  projects: ProjectInfo[];
  created: string;
}
