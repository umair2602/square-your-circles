import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import ideaCreationReducer from './slices/ideaCreationSlice';
import carbonCountReducer from './slices/carbonCountSlice';
// import themeReducer from './slices/themeSlice';
// import tempReducer from './slices/tempSlice';

// const themePersistConfig = {
//   key: 'theme',
//   storage,
//   whitelist: ['darkMode', 'fontSize'] // Only persist
// };

const ideaCreationPersistConfig = {
  key: 'ideaCreation',
  storage,
  whitelist: ['username', 'title', 'description'] // Only persist
};

const rootReducer = combineReducers({
  ideaCreation: persistReducer(ideaCreationPersistConfig, ideaCreationReducer),
  carbonCount: carbonCountReducer,
  // theme: persistReducer(themePersistConfig, themeReducer), // Persisted
  // temp: tempReducer // Not persisted
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      // }
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;