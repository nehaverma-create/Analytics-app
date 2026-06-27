import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { persistor } from "../store/store";

const ReduxPersistClearOnLogout = () => {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && !userId) {
      persistor.purge();
    }
  }, [isLoaded, userId]);

  return null;
};

export default ReduxPersistClearOnLogout;
