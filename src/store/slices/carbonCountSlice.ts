import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../index';

interface CarbonCountState {
  basePpm: number;
  baseTimestamp: string;
  currentPpm: number;
  lastDigitSequence: number; // Track the last digit sequence
}

const initialState: CarbonCountState = {
  basePpm: 0,
  baseTimestamp: '',
  currentPpm: 0,
  lastDigitSequence: 0
};

const carbonCountSlice = createSlice({
  name: 'carbonCount',
  initialState,
  reducers: {
    setBaseData: (state, action: PayloadAction<{ ppm: number; date: string }>) => {
      state.basePpm = action.payload.ppm;
      state.baseTimestamp = action.payload.date;
    },
    // Explicitly increment the last digit in sequence
    incrementLastDigit: (state) => {
      // Increment the sequence counter (0-9)
      state.lastDigitSequence = (state.lastDigitSequence + 1) % 10;
      
      // Calculate the base PPM value (all but last digit)
      const ppmPerSecond = 2.5 / (365.25 * 24 * 60 * 60);
      const now = new Date();
      const baseTime = new Date(state.baseTimestamp);
      const secondsElapsed = (now.getTime() - baseTime.getTime()) / 1000;
      const calculatedPpm = state.basePpm + (secondsElapsed * ppmPerSecond);
      
      // Get all but the last digit stable (7 decimal places fixed)
      const stablePart = Math.floor(calculatedPpm * 10000000) / 10000000;
      
      // Add the sequential last digit
      state.currentPpm = stablePart + (state.lastDigitSequence / 100000000);
    },
    updateCurrentPpm: (state) => {
      // This is now just a standard update without the sequence logic
      const ppmPerSecond = 2.5 / (365.25 * 24 * 60 * 60);
      const now = new Date();
      const baseTime = new Date(state.baseTimestamp);
      const secondsElapsed = (now.getTime() - baseTime.getTime()) / 1000;
      state.currentPpm = state.basePpm + (secondsElapsed * ppmPerSecond);
    }
  }
});

export const { setBaseData, updateCurrentPpm, incrementLastDigit } = carbonCountSlice.actions;

export const fetchCarbonCount = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('/api/carbon-count');
    const data = await response.json();
    dispatch(setBaseData(data));
  } catch (error) {
    console.error('Failed to fetch carbon count:', error);
  }
};

export default carbonCountSlice.reducer;