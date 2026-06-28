import { useNavigate } from "react-router-dom";
import Correct from "../assets/Correct-Icon.jpg";
import { useEffect, useState } from "react";
import { authService } from "../services/AuthService";
import LoadingSpinner from "../components/LoadingSpinner";

const PasswordReset = () => {
  {
    /* State for the width of the screen */
  }
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  {
    /* State for the from animation */
  }
  const [isOpening, setIsOpening] = useState(false);

  {
    /* State for handling the form submition */
  }
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Window re-size useEffect
  useEffect(() => {
    setIsOpening(true);
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  //Link validation useEffect
  useEffect(() => {
    const checkRecoveryAccess = async () => {
      const hasTokenInUrl = window.location.hash.includes("access_token=");

      const { data } = await authService.currentSession();
      const isRecoverySession =
        data?.session?.user?.app_metadata?.provider === "email" || data != null;

      if (!hasTokenInUrl && !isRecoverySession) {
        navigate("/login", { replace: true });
        return;
      }
    };

    checkRecoveryAccess();
  }, [navigate]);

  const handleFormSubmition = async (e: any) => {
    e.preventDefault();

    if (newPassword == confirmNewPassword) {
      try {
        setIsLoading(true);
        const { success } = await authService.updateUserPassword(newPassword);

        if (success) setUpdateSuccessful(true);
      } catch (e: any) {
        console.error("Error occured while updating the password: ", e);
        setError("Error updating password");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Passwords do not match");
    }
  };

  if (width <= 450) {
    return (
      <div className="h-screen bg-linear-[90deg,#ffffff_0%,#999999_87%]">
        <div className="h-full flex justify-center items-center">
          {updateSuccessful ? (
            <div
              className={`w-[90%] min-w-70 py-5 px-5 bg-white rounded-lg shadow-lg font-lalezar`}
            >
              {/* 
  
              Header
            
            */}
              <p className="flex justify-center mb-2 text-[clamp(40px,2vw,150px)]">
                Password has been updated!
              </p>

              {/*
            
            Correct logo image
            
            */}
              <div className="flex justify-center mb-8">
                <img src={Correct} />
              </div>

              <p className="flex justify-center text-2xl">
                You can safely close this page now
              </p>
            </div>
          ) : (
            <div
              className={`w-[80%] min-w-70 py-5 px-5 bg-white rounded-lg shadow-lg font-lalezar transition-all duration-500 ease-out ${isOpening ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-30 blur-md"}`}
            >
              {/* 
  
              Header of the form
            
            */}
              <p className="flex justify-start mb-6 text-[clamp(40px,2vw,150px)]">
                Password Reset
              </p>

              {/*
            
              Form element
  
            */}
              <form className="mb-3" onSubmit={handleFormSubmition}>
                <label className="text-[clamp(16px,1.5vw,90px)]">
                  New Password
                </label>
                <br />
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-4"
                />
                <label className="text-[clamp(16px,1.5vw,90px)]">
                  Confirm New Password
                </label>
                <br />
                <input
                  type="password"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-4"
                />

                <div className="flex justify-center">
                  <button className="cursor-pointer flex justify-center py-2 w-full text-[clamp(1.5em,2vw,2.5em)] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                    {isLoading ? (
                      <LoadingSpinner size="medium" color="border-[#ffffff]" />
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
                {error && (
                  <p className="font-lalezar flex justify-center mt-1 text-red-500">
                    {error}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-screen bg-linear-[90deg,#ffffff_0%,#999999_87%]">
        <div className="h-full flex justify-center items-center">
          {updateSuccessful ? (
            <div
              className={`w-[45%] min-w-90 py-5 px-5 bg-white rounded-lg shadow-lg font-lalezar`}
            >
              {/* 
  
              Header
            
            */}
              <p className="flex justify-center mb-2 text-[clamp(40px,2.5vw,170px)]">
                Password has been updated!
              </p>

              {/*
            
            Correct logo image
            
            */}
              <div className="flex justify-center mb-15">
                <img src={Correct} />
              </div>

              <p className="flex justify-center text-[1.9vw]">
                You can safely close this page now
              </p>
            </div>
          ) : (
            <div
              className={`w-[40%] min-w-90 py-5 px-5 bg-white rounded-lg shadow-lg font-lalezar transition-all duration-500 ease-out ${isOpening ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-30 blur-md"}`}
            >
              {/* 
  
              Header of the form
            
            */}
              <p className="flex justify-start mb-6 text-[clamp(40px,2vw,150px)]">
                Password Reset
              </p>

              {/*
            
              Form element
  
            */}
              <form className="mb-3" onSubmit={handleFormSubmition}>
                <label className="text-[clamp(16px,1.5vw,90px)]">
                  New Password
                </label>
                <br />
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-4"
                />
                <label className="text-[clamp(16px,1.5vw,90px)]">
                  Confirm New Password
                </label>
                <br />
                <input
                  type="password"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-8"
                />

                <div className="flex justify-center">
                  <button className="cursor-pointer flex justify-center py-2 w-full text-[clamp(1.5em,2vw,2.5em)] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                    {isLoading ? (
                      <LoadingSpinner size="medium" color="border-[#ffffff]" />
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
                {error && (
                  <p className="font-lalezar flex justify-center mt-1 text-red-500 text-[clamp(1rem,1.5vw,5rem)]">
                    {error}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default PasswordReset;
