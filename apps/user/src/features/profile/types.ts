export interface UserProfile {
  _id: string; // Backend ID
  id: string; // Frontend mapped ID
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  lastQuizDate?: string;
  profilePictureUrl?: string;
  profilePictureId?: string;
  isEmailVerified: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  profilePictureUrl?: string | null;
  profilePictureId?: string | null;
}

export interface ChangePasswordRequest {
  current: string;
  new: string;
  confirm: string;
}
