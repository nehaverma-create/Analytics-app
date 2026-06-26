import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import websitesReducer from "./websitesSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["websites"],
};

const rootReducer = combineReducers({
  websites: websitesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);