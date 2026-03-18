// types/auth.ts

export interface UserData {
  sub: string;
  phone: string;
  name?: string | null;
  role: string;
}

export interface VerifyCodeResponse {
  token?: string;
  message?: string;
  user?: UserData; // Якщо бекенд повертає юзера разом з токеном
}