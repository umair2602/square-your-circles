import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IdeaCreationState {
  username: string;
  title: string;
  description: string;
  w3wlocation: string;
  citedIdeas: string[];
  score: number;
  responses: Record<string, string>;
  currentStep: number;
}

const initialState: IdeaCreationState = {
  username: '',
  title: '',
  description: '',
  w3wlocation: '',
  citedIdeas: [],
  score: 0,
  responses: {},
  currentStep: 0,
};

const ideaCreationSlice = createSlice({
  name: 'ideaCreation',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setW3wLocation: (state, action: PayloadAction<string>) => {
      state.w3wlocation = action.payload;
    },
    setCitedIdeas: (state, action: PayloadAction<string[]>) => {
      state.citedIdeas = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setResponses: (state, action: PayloadAction<Record<string, string>>) => {
      state.responses = { ...state.responses, ...action.payload };
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetForm: (state) => {
      state.title = '';
      state.description = '';
      state.w3wlocation = '';
      state.citedIdeas = [];
      state.score = 0;
      state.responses = {};
      state.currentStep = 0;
    },
  }
});

export const { setUsername, setTitle, setDescription, setW3wLocation, setCitedIdeas, resetForm, setScore, setResponses, setCurrentStep } = ideaCreationSlice.actions;
export default ideaCreationSlice.reducer;