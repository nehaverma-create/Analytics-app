import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRoutes from "./AppRoutes";
import ReduxPersistClearOnLogout from "./components/ReduxPersistClearOnLogout";
import { store, persistor } from "./store/store";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReduxPersistClearOnLogout />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ClerkProvider>
);