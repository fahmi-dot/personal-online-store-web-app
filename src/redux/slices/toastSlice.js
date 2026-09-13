import { createSlice } from "@reduxjs/toolkit";

let nextToastId = 1;

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: ({ message, type = "info", duration = 4000 }) => {
        return {
          payload: {
            id: nextToastId++,
            message,
            type, // 'success' | 'error' | 'warning' | 'info'
            duration,
          },
        };
      },
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

// Helper dispatchers for convenience
export const showSuccessToast = (message, duration) =>
  addToast({ message, type: "success", duration });

export const showErrorToast = (message, duration) =>
  addToast({ message, type: "error", duration });

export const showInfoToast = (message, duration) =>
  addToast({ message, type: "info", duration });

export const showWarningToast = (message, duration) =>
  addToast({ message, type: "warning", duration });

export default toastSlice.reducer;
