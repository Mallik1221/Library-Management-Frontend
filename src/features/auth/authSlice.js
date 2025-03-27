import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Get initial state safely
const getInitialState = () => {
  try {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    return {
      user,
      isAuthenticated,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error('Error getting initial state:', error);
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role
      };
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.logout();
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer; 