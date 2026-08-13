import { apiRequest } from "./index";

export interface CheckEmailExistsPayload {
  Email: string;
}

export interface CheckEmailExistsResponse {
  Exists: boolean;
}

export async function checkEmailExists(payload: CheckEmailExistsPayload) {
  return apiRequest<CheckEmailExistsResponse>("CheckEmailExists", {
    method: "POST",
    body: JSON.stringify(payload),
  });
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

export async function loginContact(payload: LoginContactPayload) {
  return apiRequest<LoginContactResponse>("LoginContact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
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

export async function registerContact(payload: RegisterContactPayload) {
  return apiRequest<RegisterContactResponse>("RegisterContact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
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

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<ResetPasswordResponse>("ResetPassword", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
