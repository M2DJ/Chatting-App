import PlaceHolderPerson from "../assets/Placeholder-Progile-Image.webp";
import NightMode from "../assets/Toggle-Night.jpg";
import Search from "../assets/Search-Icon.jpg";
import Logout from "../assets/Logout-logo.jpg";
import { useEffect, useRef, useState } from "react";
import ChatScreenMobile from "./ChatScreenMobile";
import ChatCard from "../components/ChatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { authService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const ChatScreen = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  //useEffect for the dropdown menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e?.target as Node)
      ) {
        setIsProfileSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  //useEffect for re-sizing the window
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  //Function for logging out
  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const { success, error } = await authService.logout();

      if (success) {
        navigate("/login");
      } else {
        console.error("Error occured while logging out: ", error);
        setError(error);
      }
    } catch (e) {
      console.error("Error occured while logging out: ", e);
      setError(`Error logging out: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (width <= 450) {
    return <ChatScreenMobile />;
  } else {
    return (
      <>
        <div className="h-screen font-inter px-[20px]">
          {/*
      
      Left side of the dashboard
      
      */}
          <div className="h-screen w-[35%] min-w-80 border border-y-transparent border-l-transparent">
            {/*
          
          Container that holds the margin for the left side
          
          */}
            <div className="mt-3 mr-3">
              {/*
            
            Header part with the search bar
            
            */}
              <div className="flex justify-between mb-2">
                <h1 className="font-bold text-[clamp(1.5rem,2.8vw,5.5rem)]">
                  Chatting App
                </h1>
                <div className="flex items-center">
                  <div
                    className="cursor-pointer w-[3vw] h-[3vw] border border-black/55 shadow-lg rounded-full bg-no-repeat bg-center bg-[length:70%] mr-1"
                    style={{ backgroundImage: `url(${NightMode})` }}
                  />
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => {
                        setIsProfileSettingsOpen((prev) => !prev);
                      }}
                      className="cursor-pointer w-[4vw] h-[4vw] shadow-lg border border-black/55 rounded-full bg-center bg-no-repeat bg-[length:90%]"
                      style={{ backgroundImage: `url(${PlaceHolderPerson})` }}
                    />

                    {isProfileSettingsOpen &&
                      (isLoading ? (
                        <div
                          onClick={handleLogout}
                          className="z-50 flex justify-start items-center mt-1 px-3 h-[40px] bg-white border border-black/40 rounded-xl shadow-lg absolute top-full left-1/2 -translate-x-1/2"
                        >
                          <LoadingSpinner
                            size="small"
                            color="border-[#000000]"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={handleLogout}
                          className="z-50 cursor-pointer flex justify-start items-center mt-1 px-3 h-[40px] w-28 bg-white border border-black/40 rounded-xl shadow-lg absolute top-full left-1/2 -translate-x-1/2"
                        >
                          <img src={Logout} />
                          <p>Logout</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/*
            
            Chat Search Bar
            
            */}
              <div className="relative mb-9">
                <input
                  placeholder="Search chat"
                  type="text"
                  className={`w-full h-[2vw] min-h-6 max-h-15 ${width < 2000 ? "pl-6" : "pl-10"} border rounded-md bg-[#F2F2F2] placeholder:text-[clamp(1.1rem,1.1vw,3rem)] placeholder:text-black`}
                />
                <img
                  src={Search}
                  className="w-[1.5vw] h-[1.5vw] min-w-5 min-h-5 absolute top-1/2 -translate-y-1/2 left-1"
                />
              </div>

              {/*
            
            Chat Card
            
            */}
              <ChatCard />
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ChatScreen;
