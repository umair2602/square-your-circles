// Dummy slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
  colorScheme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
}

const initialState: ThemeState = {
  darkMode: false,
  colorScheme: 'system',
  fontSize: 'medium',
  animations: true
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setColorScheme: (state, action: PayloadAction<ThemeState['colorScheme']>) => {
      state.colorScheme = action.payload;
    },
    setFontSize: (state, action: PayloadAction<ThemeState['fontSize']>) => {
      state.fontSize = action.payload;
    },
    toggleAnimations: (state) => {
      state.animations = !state.animations;
    }
  }
});

export const { toggleDarkMode, setColorScheme, setFontSize, toggleAnimations } = themeSlice.actions;
export default themeSlice.reducer;