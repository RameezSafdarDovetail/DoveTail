import { apiRequest } from "../index";
import type {
  CheckEmailExistsPayload,
  CheckEmailExistsResponse,
  LoginContactPayload,
  LoginContactResponse,
  RegisterContactPayload,
  RegisterContactResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "./auth.types";

export async function checkEmailExists(payload: CheckEmailExistsPayload) {
  return apiRequest<CheckEmailExistsResponse>("CheckEmailExists", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginContact(payload: LoginContactPayload) {
  return apiRequest<LoginContactResponse>("LoginContact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerContact(payload: RegisterContactPayload) {
  return apiRequest<RegisterContactResponse>("RegisterContact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<ResetPasswordResponse>("ResetPassword", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
