import axios from "axios";
import { Platform } from "react-native";

// Base API URL
const API_BASE = Platform.OS === "android"
  ? "http://10.0.2.2:8080/api"
  : "http://localhost:8080/api";

// Payload for Google registration
export interface GoogleUserPayload {
  gId: string;
  username: string;
  email: string;
  profile_pic?: string | null;
}

// Backend user type
export interface User {
  id: number;
  username: string;
  email: string;
  profile_pic?: string | null;
  gId?: string;
}

// Register Google user
export const createUser = async (user: GoogleUserPayload): Promise<User> => {
  const response = await axios.post<User>(
    `${API_BASE}/auth/register/google`,
    {
      username: user.username,
      email: user.email,
      gId: user.gId,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

// Get user by Google ID
export const getUserByGoogleId = async (gId: string): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${API_BASE}/users/google/${gId}`);
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null; // User not found
    }
    throw err;
  }
};
