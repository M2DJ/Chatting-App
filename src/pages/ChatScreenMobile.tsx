import PlaceHolderPerson from "../assets/Placeholder-Progile-Image.webp";
import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";
import Search from "../assets/Search-Icon.jpg";
import Logout from "../assets/Logout-logo.jpg";
import { useEffect, useRef, useState } from "react";
import ChatCard from "../components/ChatCard";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { authService } from "../services/AuthService";
import { useTheme } from "../context/ThemeContext";
import ChatRoom from "../components/ChatRoom";
import { IoMdChatbubbles } from "react-icons/io";
import { channelService } from "../services/ChannelService";
import type { SearchedUsers } from "../interfaces/SupabaseInterface";
import ChatCardSearch from "../components/ChatCardSearch";

const ChatScreenMobile = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  //Chat state
  const [chatSelected, setChatSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<SearchedUsers[]>([]);
  const hasSearched = useRef(false);

  //Loading state
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

  //useEffect for the window re-sizing
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

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const { success, error } = await authService.logout();

      if (success) {
        navigate("/login");
      } else {
        console.error("Error occured while logging out: ", error);
      }
    } catch (e) {
      console.error("Error occured while logging out: ", e);
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
      hasSearched.current = true;
    } catch (e: any) {
      console.error("Error searching for users: ", e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(searchedUsers);

  if (isValidating) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" color="border-[#000000]" />
      </div>
    );
  }

  return (
    <div className="h-screen font-inter px-[10px] bg-[#ffffff] dark:bg-[#333333]">
      {/*
      
      Left side of the dashboard
      
      */}
      <div className="h-screen min-w-40">
        {/*
          
          Container that holds the margin for the left side
          
          */}
        <div className="pt-2">
          {/*
            
            Header part with the search bar
            
            */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-bold text-[clamp(1.5rem,2.8vw,5.5rem)] text-text-light dark:text-text-dark">
              Chatting App
            </h1>
            <div className="flex items-center">
              <div
                onClick={toggleDarkMode}
                className="cursor-pointer w-[8vw] h-[8vw] border border-black/55 shadow-lg rounded-full bg-no-repeat bg-center bg-[length:70%] mr-3"
              >
                {isDarkMode ? (
                  <MdLightMode className="w-full h-full p-1" color="#ffffff" />
                ) : (
                  <MdOutlineDarkMode className="w-full h-full p-1.5" />
                )}
              </div>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => {
                    setIsProfileSettingsOpen((prev) => !prev);
                  }}
                  className="cursor-pointer w-[11vw] h-[11vw] shadow-lg border border-black/55 rounded-full bg-center bg-no-repeat bg-[length:90%]"
                  style={{ backgroundImage: `url(${PlaceHolderPerson})` }}
                />

                {isProfileSettingsOpen &&
                  (isLoading ? (
                    <div className="z-50 flex justify-start items-center mt-1 px-3 h-[40px] bg-white border border-black/40 rounded-xl shadow-lg absolute top-full right-0">
                      <LoadingSpinner size="small" color="border-[#000000]" />
                    </div>
                  ) : (
                    <div
                      onClick={handleLogout}
                      className="z-50 flex justify-start items-center mt-1 px-3 h-[40px] w-28 bg-white border border-black/40 rounded-xl shadow-lg absolute top-full right-0"
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
          <form className="relative mb-5" onSubmit={handleSearch}>
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
          
          Chat Cards
          
          */}
          <div>
            {isLoading ? (
              <div className=" flex justify-center">
                <LoadingSpinner
                  size="medium"
                  color={isDarkMode ? "border-[#ffffff]" : "border-[#000000]"}
                />
              </div>
            ) : (
              <>
                {searchedUsers.length == 0 && hasSearched.current == true ? (
                  <p className="flex justify-center text-[clamp(16px,1.8vw,180px)] text-text-light dark:text-text-dark">
                    No Matches Found
                  </p>
                ) : (
                  searchedUsers.map((user, index) => (
                    <div key={index}>
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

        {/*
          
          The chat itself

          */}
        {chatSelected && (
          <div className="flex-1 ml-3 mt-2">
            <ChatRoom room={chatSelected} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreenMobile;
