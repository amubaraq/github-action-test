import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../../config";

// Login Action
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok) {
        // Check if the response contains user and authorization data
        const userData = result.data?.user || null;
        const authData = result.data?.authorization || null;

        // If no user or auth data, assume it's an admin/agent requiring verification
        if (!userData || !authData) {
          // Infer role or set a default (adjust based on API behavior)
          const role = result.data?.user?.role || "user"; // May need adjustment if role isn't returned
          return {
            user: null, // No user data yet for admin/agent
            token: null, // No token yet
            role,
            requiresVerification: true,
            message:
              result.message || "Authentication code sent. Please verify.",
          };
        }

        // Check if the user requires verification (admin or agent)
        const role = userData.role || "user";
        const requiresVerification = ["admin", "agent"].includes(role);

        if (!requiresVerification && authData.token) {
          // For non-admin/agent with a token, store immediately
          localStorage.setItem("userInfo", JSON.stringify(userData));
          localStorage.setItem("userToken", authData.token); // Store token as string
        }

        return {
          user: userData,
          token: authData?.token || null,
          role,
          requiresVerification,
        };
      } else {
        // Handle specific error messages
        if (result.message.includes("verify your email")) {
          return rejectWithValue("Please verify your email before logging in.");
        } else if (result.message.includes("Invalid credentials")) {
          return rejectWithValue("Invalid email or password.");
        } else if (result.message.includes("User not found")) {
          return rejectWithValue("User not found.");
        } else {
          return rejectWithValue(result.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login Error:", error); // Log the error for debugging
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

// Verify Auth Code Action
export const verifyAuthCode = createAsyncThunk(
  "auth/verifyAuthCode",
  async ({ email, auth_code }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/verify/dashboard/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, auth_code }),
      });

      const result = await response.json();

      console.log("Verify Code Response:", result); // Log the full response for debugging

      if (response.ok) {
        const userData = result.data.user;
        const authData = result.data.authorization;

        // Store in localStorage after successful verification
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("userToken", authData.token); // Store token as string

        return {
          user: userData,
          token: authData.token,
          role: userData.role || "user",
        };
      } else {
        if (result.message.includes("Invalid authentication code")) {
          return rejectWithValue("Invalid authentication code.");
        } else if (result.message.includes("User not found")) {
          return rejectWithValue("User not found.");
        } else {
          return rejectWithValue(result.message || "Verification failed");
        }
      }
    } catch (error) {
      console.error("Verify Code Error:", error); // Log the error for debugging
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

// Logout Action
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    token: localStorage.getItem("userToken") || null, // Store token as string
    role: null,
    requiresVerification: false,
    message: null, // Store the message for display
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.requiresVerification = false;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token; // Token will be null for admin/agent
        state.role = action.payload.role;
        state.requiresVerification = action.payload.requiresVerification;
        state.message = action.payload.message || null; // Store the success message
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null;
        state.token = null;
        state.role = null;
        state.requiresVerification = false;
        state.message = null;
      });

    // Verify Auth Code
    builder
      .addCase(verifyAuthCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAuthCode.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.requiresVerification = false;
        state.message = null;
        state.error = null;
      })
      .addCase(verifyAuthCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = null; // Clear token if verification fails
        state.requiresVerification = true; // Keep requiring verification
        state.message = null;
      });

    // Logout User
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        state.role = null;
        state.requiresVerification = false;
        state.message = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
