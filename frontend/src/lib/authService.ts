import api from "./axios"
import {
  AuthResponse,
  SignupPayload,
  LoginPayload,
} from "../types/auth";

export async function signupRequest(
  payload: SignupPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/signup",
    payload
  );

  return data;
}

export async function loginRequest(
  payload: LoginPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/login",
    payload
  );

  return data;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout");
}