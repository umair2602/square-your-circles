import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../index';

interface CarbonCountState {
  basePpm: number;
  baseTimestamp: string;
  currentPpm: number;
}

const initialState: CarbonCountState = {
  basePpm: 0,
  baseTimestamp: '',
  currentPpm: 0
};

const carbonCountSlice = createSlice({
  name: 'carbonCount',
  initialState,
  reducers: {
    setBaseData: (state, action: PayloadAction<{ ppm: number; date: string }>) => {
      state.basePpm = action.payload.ppm;
      state.baseTimestamp = action.payload.date;
    },
    updateCurrentPpm: (state) => {
      const ppmPerSecond = 2.5 / (365.25 * 24 * 60 * 60);
      const now = new Date();
      const baseTime = new Date(state.baseTimestamp);
      const secondsElapsed = (now.getTime() - baseTime.getTime()) / 1000;
      state.currentPpm = state.basePpm + (secondsElapsed * ppmPerSecond);
    }
  }
});

export const { setBaseData, updateCurrentPpm } = carbonCountSlice.actions;

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