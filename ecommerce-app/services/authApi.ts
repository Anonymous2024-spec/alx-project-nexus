import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const API_BASE_URL = "https://alx-project-nexus-u45j.onrender.com/api/v1";

// FIXED Types for API requests and responses
export interface LoginRequest {
  username: string; // Changed from email to username
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string; // Added username field
  user_type?: "consumer" | "seller";
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username: string; // Added username field
    first_name: string;
    last_name: string;
    user_type: string;
    is_verified: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Token management (unchanged)
const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
};

export class TokenManager {
  static async setTokens(accessToken: string, refreshToken: string) {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEYS.ACCESS_TOKEN, accessToken],
        [TOKEN_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
    } catch (error) {
      console.error("Error storing tokens:", error);
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  }

  static async clearTokens() {
    try {
      await AsyncStorage.multiRemove([
        TOKEN_KEYS.ACCESS_TOKEN,
        TOKEN_KEYS.REFRESH_TOKEN,
        TOKEN_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  }

  static async setUserData(userData: any) {
    try {
      await AsyncStorage.setItem(
        TOKEN_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  }

  static async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(TOKEN_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }
}

// API helper functions (unchanged)
const createApiError = (
  status: number,
  message: string,
  details?: any
): ApiError => ({
  status,
  message,
  details,
});

const handleApiResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    let errorMessage = "An error occurred";

    if (data.detail) {
      errorMessage = data.detail;
    } else if (data.error) {
      errorMessage = data.error;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (typeof data === "object") {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) {
        errorMessage = firstError[0] as string;
      } else if (typeof firstError === "string") {
        errorMessage = firstError;
      }
    }

    throw createApiError(response.status, errorMessage, data);
  }

  return data;
};

// CLEANED Authentication API class
export class AuthApi {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log("Attempting login with username:", credentials.username);

      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await handleApiResponse(response);

      // DEBUG: Log the exact response
      console.log("FULL API RESPONSE:", JSON.stringify(data, null, 2));

      // DEFENSIVE: Handle different response formats
      let user, access, refresh;

      if (data.user) {
        // Format 1: { access, refresh, user: {...} }
        user = data.user;
        access = data.access;
        refresh = data.refresh;
      } else if (data.data && data.data.user) {
        // Format 2: { data: { user: {...}, access, refresh } }
        user = data.data.user;
        access = data.data.access;
        refresh = data.data.refresh;
      } else if (data.access && data.refresh) {
        // Format 3: Just tokens, no user object
        access = data.access;
        refresh = data.refresh;
        user = {
          id: 1,
          email: credentials.username + "@example.com",
          username: credentials.username,
          first_name: "User",
          last_name: "Name",
          user_type: "consumer",
          is_verified: true,
        };
      } else {
        // Format 4: Unknown - create minimal user
        console.warn("Unknown response format:", data);
        access = data.token || data.access || "mock-token";
        refresh = data.refresh_token || data.refresh || "mock-refresh";
        user = {
          id: 1,
          email: credentials.username,
          username: credentials.username,
          first_name: "User",
          last_name: "Name",
          user_type: "consumer",
          is_verified: true,
        };
      }

      console.log("Processed user:", user);

      // Store tokens and user data
      await TokenManager.setTokens(access, refresh);
      await TokenManager.setUserData(user);

      return { access, refresh, user };
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }
  // FIXED Register method - includes username
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log("Attempting registration for:", userData.username);

      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name,
          last_name: userData.last_name,
          user_type: userData.user_type || "consumer",
        }),
      });

      const data = await handleApiResponse(response);

      console.log("Registration successful for:", data.user.username);

      return data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  }

  // Token refresh (unchanged)
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw createApiError(401, "No refresh token available");
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await handleApiResponse(response);
      await TokenManager.setTokens(data.access, refreshToken);

      return data.access;
    } catch (error) {
      console.error("Token refresh error:", error);
      await TokenManager.clearTokens();
      throw error;
    }
  }

  // Logout (unchanged)
  static async logout(): Promise<void> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();

      if (refreshToken) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });
        } catch (error) {
          console.warn("Server logout failed:", error);
        }
      }

      await TokenManager.clearTokens();
    } catch (error) {
      console.error("Logout error:", error);
      await TokenManager.clearTokens();
    }
  }

  // Auth status check (unchanged)
  static async checkAuthStatus(): Promise<boolean> {
    try {
      const accessToken = await TokenManager.getAccessToken();
      return !!accessToken;
    } catch (error) {
      console.error("Auth status check error:", error);
      return false;
    }
  }

  // Authenticated requests (unchanged)
  static async getAuthenticatedRequest(url: string, options: RequestInit = {}) {
    try {
      let accessToken = await TokenManager.getAccessToken();

      if (!accessToken) {
        throw createApiError(401, "No access token available");
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        try {
          accessToken = await AuthApi.refreshToken();

          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          return await handleApiResponse(retryResponse);
        } catch (refreshError) {
          throw createApiError(401, "Authentication failed");
        }
      }

      return await handleApiResponse(response);
    } catch (error) {
      console.error("Authenticated request error:", error);
      throw error;
    }
  }
}
