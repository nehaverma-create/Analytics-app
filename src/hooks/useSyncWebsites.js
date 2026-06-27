import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { setWebsites } from "../store/websitesSlice";
import { useAuthFetch } from "./useAuthFetch";

export function useSyncWebsites() {
  const { isLoaded, isSignedIn } = useAuth();
  const authFetch = useAuthFetch();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    authFetch("/api/websites")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load websites");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) return;

        dispatch(
          setWebsites(
            data.map((website) => ({
              id: website.id,
              websiteName: website.name,
              domain: website.domain,
              trackingId: website.trackingId,
              trackingScript: website.trackingScript,
              createdAt: new Date(website.createdAt).toLocaleDateString(),
            }))
          )
        );
      })
      .catch((err) => {
        console.error("Failed to sync websites:", err);
      });
  }, [isLoaded, isSignedIn, authFetch, dispatch]);
}
