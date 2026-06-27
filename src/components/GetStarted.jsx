import { ChevronRight, UserRound } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const GetStarted = ({ variant = "button", isShowProfile = false }) => {
  const navigate = useNavigate();

  return (
    <div>
     
      <SignedOut>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          {variant === "link" ? (
            <div className="home-navLink">
              <span className="home-divider"></span>
              <UserRound size={18} />
              <span>Get Started</span>
            </div>
          ) : (
            <button className="home-ctaButton">
              <span>Get Started</span>
              <ChevronRight size={18} />
            </button>
          )}
        </SignUpButton>
      </SignedOut>

    
      <SignedIn>
        {variant === "link" ? (
          <div className="home-userSection">
            <div
              className="home-navLink"
              onClick={() => navigate("/dashboard")}
            >
              <span className="home-divider"></span>
              <span>Go to Dashboard</span>
            </div>

            {/* Clerk default modal includes signOut */}
            {isShowProfile && <UserButton  />}
          </div>
        ) : (
          <button
            className="home-ctaButton"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <ChevronRight size={18} />
          </button>
        )}
      </SignedIn>
    </div>
  );
};

export default GetStarted;