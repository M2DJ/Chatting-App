import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import X from "../assets/X-Logo.png";
import Facebook from "../assets/Facebook-Logo.png";
import Google from "../assets/Google-Logo.webp";
import { authService } from "../services/AuthService";
import LoadingSpinner from "../components/LoadingSpinner";

const SignUpPage = () => {
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
    /*
    State for form submition  
  */
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      if (confirmPassword == password) {
        const { success } = await authService.signUpWithEmail(
          email,
          password,
        );

        if (success) {
          setIsLoading(false);
          navigate("/login");
        } else {
          setError("Failed to Sign Up, Please Try agian");
        }
      } else {
        setError("Passwords do not match");
      }
    } catch (e) {
      console.error("Error signing up: ", e);
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
              Sign Up
            </p>

            {/*
          
            Form element

          */}
            <form className="mb-3" onSubmit={handleFormSubmition}>
              <label className="text-[clamp(16px,1.5vw,90px)]">Email</label>
              <br />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="h-[5vh] min-h-9 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-1"
              />
              <label className="text-[clamp(16px,1.5vw,90px)]">Password</label>
              <br />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="h-[5vh] min-h-9 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-1"
                type="password"
              />
              <label className="text-[clamp(16px,1.5vw,90px)]">
                Confirm Password
              </label>
              <br />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-[5vh] min-h-9 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-5"
                type="password"
              />

              <div className="flex justify-center">
                <button className="cursor-pointer flex justify-center items-center py-2 w-full text-[clamp(1.5em,2vw,2.5em)] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                  {isLoading ? (
                    <LoadingSpinner size="small" color="#FFFFFF" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-lg flex justify-center">
                  {error}
                </p>
              )}
            </form>

            {/*
          
          Navigate to the Sign Up screen
          
          */}
            <div className="flex justify-center mb-2 font-inter text-[clamp(16px,1vw,100px)]">
              <p className="mr-1">Already have an account?</p>
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
            <p className="flex justify-center mb-2 text-[clamp(40px,2vw,150px)]">
              Sign Up
            </p>

            {/*
          
            Form element

          */}
            <form className="mb-3" onSubmit={handleFormSubmition}>
              <label className="text-[clamp(16px,1.5vw,90px)]">Email</label>
              <br />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="h-[4vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-1"
              />
              <label className="text-[clamp(16px,1.5vw,90px)]">Password</label>
              <br />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="h-[4vh] min-h-10 max-h-80 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-1"
                type="password"
              />
              <label className="text-[clamp(16px,1.5vw,90px)]">
                Confirm Password
              </label>
              <br />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-[4vh] min-h-10 max-h-80 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 bg-[#f2f2f2] rounded-xl pl-2 mb-5"
                type="password"
              />

              <div className="flex justify-center">
                <button className="cursor-pointer flex justify-center items-center py-2 w-full text-[clamp(1.5em,2vw,2.5em)] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                  {isLoading ? (
                    <LoadingSpinner size="medium" color="border-[#fffff9]" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-lg flex justify-center">
                  {error}
                </p>
              )}
            </form>

            {/*
          
          Navigate to the Sign Up screen
          
          */}
            <div className="flex justify-center mb-2 font-inter text-[clamp(16px,1vw,100px)]">
              <p className="mr-1">Already have an account?</p>
              <button
                className="cursor-pointer text-blue-700"
                onClick={() => {
                  setIsOpening(false);

                  setTimeout(() => navigate("/login"), 500);
                }}
              >
                Login
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

export default SignUpPage;
