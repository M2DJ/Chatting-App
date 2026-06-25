import { useEffect, useState } from "react";
import Facebook from "../assets/Facebook-Logo.png";
import Google from "../assets/Google-Logo.webp";
import X from "../assets/X-Logo.png";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/AuthService";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = () => {
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
    /* State for form submition */
  }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setIsOpening(true);
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  const handleFormSubmition = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { success, error } = await authService.loginWithEmail(
        email,
        password,
      );

      if (success) {
        navigate("/chat");
      } else {
        setError(`Error logging in: ${error}`);
      }
    } catch (e) {
      console.log("Error logging in: ", e);
      setError(`Error logging in: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (width <= 450) {
    return (
      <div className="h-screen bg-linear-[90deg,#ffffff_0%,#999999_87%]">
        <div className="h-full flex justify-center items-center">
          <div
            className={`w-[90%] min-w-70 py-5 px-3 bg-white rounded-lg shadow-lg font-lalezar transition-all duration-500 ease-out ${isOpening ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-30 blur-md"}`}
          >
            {/* 

            Header of the form
          
          */}
            <p className="flex justify-center mb-6 text-[clamp(40px,2vw,150px)]">
              Login
            </p>

            {/*
          
            Form element

          */}
            <form className="mb-3" onSubmit={handleFormSubmition}>
              <label className="text-[clamp(16px,1.5vw,90px)]">Email</label>
              <br />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="h-[5vh] min-h-9 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-4"
              />
              <label className="text-[clamp(16px,1.5vw,90px)]">Password</label>
              <br />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="h-[5vh] min-h-9 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 rounded-xl pl-2 mb-4"
              />

              <div className="flex justify-end mb-8">
                <button
                  className="cursor-pointer text-[clamp(16px,1.5vw,90px)]"
                  onClick={() => {
                    setIsOpening(false);

                    setTimeout(() => navigate("/forgotpassword"), 500);
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex justify-center">
                <button type="submit" className="cursor-pointer py-2 w-full text-[clamp(1.5em,2vw,2.5em)] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <LoadingSpinner size="medium" color="border-[#ffffff]" />
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-1 text-red-500 text-lg flex justify-center">
                  {error}
                </p>
              )}
            </form>

            {/*
          
          Navigate to the Sign Up screen
          
          */}
            <div className="flex justify-center mb-2 font-inter text-[clamp(16px,1vw,100px)]">
              <p className="mr-1">Don't have an account?</p>
              <button
                className="cursor-pointer text-blue-700"
                onClick={() => {
                  setIsOpening(false);

                  setTimeout(() => navigate("/signup"), 500);
                }}
              >
                Sign Up
              </button>
            </div>

            {/*
            
          Other login methods section
            
          */}
            <div className="flex justify-around items-center mb-5">
              <div className="h-0.5 w-[40%] bg-black" />

              <p className="text-[clamp(16px,1.5vw,90px)]">OR</p>

              <div className="h-0.5 w-[40%] bg-black" />
            </div>

            <div className="flex justify-around items-center">
              <div
                className="w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-[length:60%] bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${X})` }}
              />

              <div
                className="w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-[length:120%] bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${Facebook})` }}
              />

              <div
                className="w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-contain"
                style={{ backgroundImage: `url(${Google})` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-screen bg-linear-[90deg,#ffffff_0%,#999999_87%]">
        <div className="h-full flex justify-center items-center">
          <div
            className={`w-[40%] min-w-90 py-5 px-3 bg-white rounded-lg shadow-lg font-lalezar transition-all duration-500 ease-out ${isOpening ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-30 blur-md"}`}
          >
            {/* 

            Header of the form
          
          */}
            <p className="flex justify-center mb-6 text-[clamp(40px,2vw,150px)]">
              Login
            </p>

            {/*
          
            Form element

          */}
            <form className="mb-3" onSubmit={handleFormSubmition}>
              <label className="text-[clamp(16px,1.5vw,90px)]">Email</label>
              <br />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-4"
              />
              <label className="text-[clamp(16px,1.5vw,90px)]">Password</label>
              <br />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="h-[5vh] min-h-10 max-h-80 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 rounded-xl pl-2 mb-4"
              />

              <div className="flex justify-end mb-8">
                <button
                  className="cursor-pointer text-[clamp(16px,1.5vw,90px)]"
                  onClick={() => {
                    setIsOpening(false);

                    setTimeout(() => navigate("/forgotpassword"), 500);
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex justify-center">
                <button type="submit" className="cursor-pointer py-2 w-full text-[clamp(1.5em,2vw,2.5em)] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <LoadingSpinner size="medium" color="border-[#ffffff]" />
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-1 text-red-500 text-lg flex justify-center">
                  {error}
                </p>
              )}
            </form>

            {/*
          
          Navigate to the Sign Up screen
          
          */}
            <div className="flex justify-center mb-2 font-inter text-[clamp(16px,1vw,100px)]">
              <p className="mr-1">Don't have an account?</p>
              <button
                className="cursor-pointer text-blue-700"
                onClick={() => {
                  setIsOpening(false);

                  setTimeout(() => navigate("/signup"), 500);
                }}
              >
                Signup
              </button>
            </div>

            {/*
            
          Other login methods section
            
          */}
            <div className="flex justify-around items-center mb-5">
              <div className="h-0.5 w-[40%] bg-black" />

              <p className="text-[clamp(16px,1.5vw,90px)]">OR</p>

              <div className="h-0.5 w-[40%] bg-black" />
            </div>

            <div className="flex justify-around items-center">
              <div
                className="cursor-pointer w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-[length:60%] bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${X})` }}
              />

              <div
                className="cursor-pointer w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-[length:120%] bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${Facebook})` }}
              />

              <div
                className="cursor-pointer w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-contain"
                style={{ backgroundImage: `url(${Google})` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginPage;
