import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IdeaCreationState {
  username: string;
  title: string;
  description: string;
  w3wlocation: string;
  citedIdeas: string[];
}

const initialState: IdeaCreationState = {
  username: '',
  title: '',
  description: '',
  w3wlocation: '',
  citedIdeas: []
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
    resetForm: (state) => {
      state.title = '';
      state.description = '';
      state.w3wlocation = '';
      state.citedIdeas = [];
    }
  }
});

export const { setUsername, setTitle, setDescription, setW3wLocation, setCitedIdeas, resetForm } = ideaCreationSlice.actions;
export default ideaCreationSlice.reducer;