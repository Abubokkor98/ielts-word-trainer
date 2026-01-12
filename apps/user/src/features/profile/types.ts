export interface UserProfile {
  _id: string; // Backend ID
  id: string; // Frontend mapped ID
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  lastQuizDate?: string;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  current: string;
  new: string;
  confirm: string;
}
