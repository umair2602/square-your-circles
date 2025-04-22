import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Ideas = {
  _id: string;
  username: string;
  ideaTitle: string;
  carbonCount: number;
  w3w: string;
};

interface IdeasState {
  ideas: Ideas[];
}

const initialState: IdeasState = {
  // ideas: [
  //   {
  //     _id: '1',
  //     username: 'eco_warrior',
  //     ideaTitle: 'Urban Tree Plantation',
  //     carbonCount: 123,
  //     w3w: 'tree.plant.green',
  //   },
  //   {
  //     _id: '2',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '2',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '3',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '4',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '5',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '6',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '7',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '8',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '9',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '10',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '11',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '12',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '13',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  //   {
  //     _id: '14',
  //     username: 'nature_lover',
  //     ideaTitle: 'Community Composting',
  //     carbonCount: 76,
  //     w3w: 'compost.bin.local',
  //   },
  //   {
  //     _id: '15',
  //     username: 'climate_hero',
  //     ideaTitle: 'Solar Panel Sharing',
  //     carbonCount: 98,
  //     w3w: 'sun.power.share',
  //   },
  // ]
  ideas: [],
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    setIdeas: (state, action: PayloadAction<any[]>) => {
      state.ideas = action.payload;
    },
  }
});

export const { setIdeas } = ideasSlice.actions;
export default ideasSlice.reducer;