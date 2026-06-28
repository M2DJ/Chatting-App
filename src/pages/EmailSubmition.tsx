import { useEffect, useState } from "react";
import { authService } from "../services/AuthService";
import LoadingSpinner from "../components/LoadingSpinner";

const EmailSubmition = () => {
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

  //Email state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsOpening(true);
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  const handleFormSubmition = async () => {
    try {
      setIsLoading(true);

      const { success, error } = await authService.sendPasswordResetEmail(
        email,
        "http://localhost:5173/#/passwordreset",
      );

      setIsLoading(false);

      if (success) {
        alert("An email has been sent, check your inbox");
      } else {
        alert(`Error sending email: ${error}`);
      }
    } catch (e: any) {
      alert(`Error sending email: ${e}`);
    }
  };

  if (width <= 450) {
    return (
      <div className="h-screen bg-auth-light dark:bg-auth-dark">
        <div className="h-full flex justify-center items-center">
          <div
            className={`w-[80%] min-w-70 py-5 px-5 bg-form-light dark:bg-form-dark rounded-lg shadow-lg font-lalezar transition-all duration-500 ease-out ${isOpening ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-30 blur-md"}`}
          >
            {/* 

            Header of the form
          
          */}
            <p className="flex justify-start mb-6 text-[clamp(40px,2vw,150px)] text-text-light dark:text-text-dark">
              Password Reset
            </p>

            {/*
          
            Form element

          */}
            <form className="mb-3" onSubmit={handleFormSubmition}>
              <label className="text-[clamp(16px,1.5vw,90px)] text-text-light dark:text-text-dark">
                Enter Email For Password Change
              </label>
              <br />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-4"
              />

              <div className="flex justify-center">
                <button className="cursor-pointer flex justify-center py-2 w-full text-[clamp(1.5em,2vw,2.5em)] text-text-light dark:text-text-dark sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 dark:border-white/50 rounded-md bg-auth-light dark:bg-auth-dark">
                  {isLoading ? (
                    <LoadingSpinner size="medium" color="border-[#ffffff]" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-screen bg-auth-light dark:bg-auth-dark">
        <div className="h-full flex justify-center items-center">
          <div
            className={`w-[40%] min-w-90 py-5 px-5 bg-form-light dark:bg-form-dark rounded-lg shadow-lg font-lalezar transition-all duration-500 ease-out ${isOpening ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-30 blur-md"}`}
          >
            {/* 

            Header of the form
          
          */}
            <p className="flex justify-start mb-6 text-[clamp(40px,2vw,150px)] text-text-light dark:text-text-dark">
              Password Reset
            </p>

            {/*
          
            Form element

          */}
            <form className="mb-3" onSubmit={handleFormSubmition}>
              <label className="text-[clamp(16px,1.5vw,90px)] text-text-light dark:text-text-dark">
                Enter Email For Password Change
              </label>
              <br />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-4"
              />

              <div className="flex justify-center">
                <button className="cursor-pointer flex justify-center py-2 w-full text-[clamp(1.5em,2vw,2.5em)] text-text-light dark:text-text-dark sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 dark:border-white/50 rounded-md bg-auth-light dark:bg-auth-dark">
                  {isLoading ? (
                    <LoadingSpinner size="medium" color="border-[#ffffff]" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default EmailSubmition;
