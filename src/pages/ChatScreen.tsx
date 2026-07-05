import PlaceHolderPerson from "../assets/Placeholder-Progile-Image.webp";
import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import Search from "../assets/Search-Icon.jpg";
import Logout from "../assets/Logout-logo.jpg";
import React, { useEffect, useRef, useState } from "react";
import ChatScreenMobile from "./ChatScreenMobile";
import ChatCard from "../components/ChatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { authService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ChatRoom from "../components/ChatRoom";
import ChatCardSearch from "../components/ChatCardSearch";
import type { SearchedUsers } from "../interfaces/SupabaseInterface";
import { channelService } from "../services/ChannelService";

const ChatScreen = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  //Chat state
  const [chatSelected, setChatSelected] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<SearchedUsers[]>([]);
  const hasSearched = useRef(false);

  //loading state
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  //Ref hook for the alert when there is no session
  const hasAlerted = useRef(false);
  //Theme hook
  const { isDarkMode, toggleDarkMode } = useTheme();

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

  //useEffect for when there is no session
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsValidating(true);

        const { data } = await authService.currentSession();

        const sessionExists = !!data?.session;

        if (!sessionExists) {
          if (!hasAlerted.current) {
            hasAlerted.current = true;
            alert("You must have an account to chat");
          }
          navigate("/login", { replace: true });
        }
      } catch (e: any) {
        console.error("Error: ", e);
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, [navigate]);

  //Function for logging out
  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const { success, error } = await authService.logout();

      if (success) {
        navigate("/login");
      } else {
        console.error("Error occured while logging out: ", error);
        alert(`Error logging out: ${error}`);
      }
    } catch (e) {
      console.error("Error occured while logging out: ", e);
      alert(`Error logging out: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  //Function for looking up user
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { data: users, error } =
        await channelService.lookUpUsers(searchQuery);
      if (error) {
        setError(error);
      }

      setSearchedUsers(users!);
      console.log(searchedUsers);
      hasSearched.current = true;
    } catch (e: any) {
      console.error("Error searching for users: ", e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" color="border-[#000000]" />
      </div>
    );
  }

  if (width <= 450) {
    return <ChatScreenMobile />;
  } else {
    return (
      <>
        <div className="flex h-screen font-inter px-[20px] bg-[#ffffff] dark:bg-[#333333]">
          {/*
      
      Left side of the dashboard
      
      */}
          <div className="h-screen w-[35%] min-w-80 border border-border-light dark:border-border-dark border-y-transparent border-l-transparent dark:border-y-transparent dark:border-l-transparent">
            {/*
          
          Container that holds the margin for the left side
          
          */}
            <div className="mt-3 mr-3">
              {/*
            
            Header part with the search bar
            
            */}
              <div className="flex justify-between mb-2">
                <h1 className="font-bold text-[clamp(1.5rem,2.8vw,5.5rem)] text-text-light dark:text-text-dark">
                  Chatting App
                </h1>
                <div className="flex items-center">
                  <div
                    onClick={toggleDarkMode}
                    className="cursor-pointer w-[3vw] h-[3vw] border border-black/55 shadow-lg rounded-full flex justify-center items-center mr-1"
                  >
                    {isDarkMode ? (
                      <MdLightMode
                        className="w-full h-full p-1"
                        color="#ffffff"
                      />
                    ) : (
                      <MdOutlineDarkMode className="w-full h-full p-1.5" />
                    )}
                  </div>
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
                          className="z-50 cursor-pointer flex justify-start items-center mt-1 px-2 h-[4vw] min-w-max bg-white border border-black/40 rounded-xl shadow-lg absolute top-full left-1/2 -translate-x-1/2"
                        >
                          <img src={Logout} className="w-[2vw]" />
                          <p className="text-[clamp(1rem,1.5vw,3rem)]">
                            Logout
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/*
            
            Chat Search Bar
            
            */}
              <form className="relative mb-9" onSubmit={handleSearch}>
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chat"
                  type="text"
                  className={`w-full h-[2vw] min-h-6 max-h-15 ${width < 2000 ? "pl-6" : "pl-10"} border rounded-md bg-input-light dark:bg-input-dark placeholder:text-[clamp(1.1rem,1.1vw,3rem)] placeholder:text-black`}
                />
                <img
                  src={Search}
                  className="w-[1.5vw] h-[1.5vw] min-w-5 min-h-5 absolute top-1/2 -translate-y-1/2 left-1"
                />
              </form>

              {/*
            
            Chat Card
            
            */}
              <div>
                {isLoading ? (
                  <div className=" flex justify-center">
                    <LoadingSpinner
                      size="medium"
                      color={
                        isDarkMode ? "border-[#ffffff]" : "border-[#000000]"
                      }
                    />
                  </div>
                ) : (
                  <>
                    {searchedUsers.length == 0 &&
                    hasSearched.current == true ? (
                      <p className="flex justify-center text-[clamp(16px,1.8vw,180px)] text-text-light dark:text-text-dark">No Matches Found</p>
                    ) : (
                      searchedUsers.map((user, index) => (
                        <div key={index} onClick={() => setChatSelected('1')}>
                          <ChatCardSearch
                            userName={
                              user.user_name != null
                                ? user.user_name
                                : user.user_email
                            }
                          />
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/*
          
          The chat itself

          */}
          <div className="flex-1 ml-3 mt-2">
            {chatSelected ? (
              <div className="h-full">
                <ChatRoom room={chatSelected}/>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <IoMdChatbubbles
                  size="9vw"
                  color={isDarkMode ? "#ffffff" : "#000000"}
                />
                <p className="text-[clamp(15px,2vw,200px)] text-text-light dark:text-text-dark">
                  Choos a room to start chatting!
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default ChatScreen;
