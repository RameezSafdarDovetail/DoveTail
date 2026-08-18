export interface CheckEmailExistsPayload {
  Email: string;
}

export interface CheckEmailExistsResponse {
  Exists: boolean;
}

export interface LoginContactPayload {
  Email: string;
  Password: string;
}

export interface LoginContactResponse {
  Token: string;
  ContactId: string;
  Email: string;
  Name: string;
}

export interface RegisterContactPayload {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
}

export interface RegisterContactResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface ResetPasswordPayload {
  Email: string;
  NewPassword: string;
}

export interface ResetPasswordResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}
