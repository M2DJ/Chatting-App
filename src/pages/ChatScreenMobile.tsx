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
import { channelService } from "../services/ChannelService";
import type { SearchedUsers } from "../interfaces/SupabaseInterface";
import ChatCardSearch from "../components/ChatCardSearch";
import type { Session } from "@supabase/supabase-js";
import type { Chats } from "../interfaces/ComponentsInterface";

const ChatScreenMobile = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  //User state
  const [userSession, setUserSession] = useState<Session>();

  //Chat state
  const [chats, setChats] = useState<Chats[]>([]);
  const [chatSelected, setChatSelected] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<SearchedUsers[]>([]);
  const [userSelected, setUserSelected] = useState<SearchedUsers>();
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

  //useEffect for the window re-sizing
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

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
        } else {
          setUserSession(data.session);
        }
      } catch (e: any) {
        console.error("Error: ", e);
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, [navigate]);

  //useEffect to subscribe for when the user creates a new room
  useEffect(() => {
    const unSub = channelService.subscribeToRoomsTable(
      userSession?.user.id!,
      (payload) => {
        console.log("New room inserted in the 'Rooms' table", payload);
        setChatSelected(payload.channel_id);
      },
    );

    return () => {
      unSub();
    };
  }, []);

  //useEffect to subscribe for when the user creates a new room
  useEffect(() => {
    if (!userSession) return;

    const fetchRoomsOnChange = async () => {
      try {
        setIsLoading(true);

        const { success, data, error } = await channelService.loadRooms(
          userSession?.user.id!,
        );
        if (success && data) {
          setChats(data);
        } else {
          console.log("Error occured in the 'ChatScreen' component: ", error);
        }
      } catch (e) {
        console.error("Error occured in the 'ChatScreen' component: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomsOnChange();

    const unSub = channelService.subscribeToRoomsTable(
      userSession?.user.id!,
      (payload) => {
        console.log("New room inserted in the 'Rooms' table", payload);
        setChatSelected(payload.channel_id);
        fetchRoomsOnChange();
        setInputValue("");
      },
    );

    return () => {
      unSub();
    };
  }, [userSession]);

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

    if (inputValue.length == 0) {
      setSearchQuery("");
      return;
    }

    setSearchQuery(inputValue);

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

  //Function for formating time
  const formatTime = (timestamp: string): string => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isValidating) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" color="border-[#000000]" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-screen font-inter px-[10px] bg-[#ffffff] dark:bg-[#333333]">
      {/*
      
      Chat selection part
      
      */}
      <div
        className={`h-screen min-w-40 transition-transform ${chatSelected ? "overflow-hidden -translate-x-full duration-300 ease-out" : ""}`}
      >
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
              onChange={(e) => setInputValue(e.target.value)}
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
                {/* 
                  
                  This part of the chat screen checks if the user searched for another user
                  if no then this part will display the users past rooms
                  
                  */}
                {searchQuery ? (
                  <>
                    {searchedUsers.length == 0 &&
                    hasSearched.current == true ? (
                      <p className="flex justify-center text-[clamp(16px,1.8vw,180px)] text-text-light dark:text-text-dark">
                        No Matches Found
                      </p>
                    ) : (
                      searchedUsers.map((user, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setUserSelected(user);
                            setChatSelected("1");
                          }}
                        >
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
                ) : (
                  <div className="">
                    {chats.map((room, index) => (
                      <div
                        key={room.channel_id}
                        onClick={() => {
                          setChatSelected(room.channel_id);
                          setUserSelected(room.otherPerson!);
                        }}
                        className="mb-3"
                      >
                        <ChatCard
                          chatterAvatarURL={null}
                          chatterEmail={room.otherPerson?.user_email ?? ""}
                          chatterLastMessage={room.lastMessage}
                          lastMessageTime={formatTime(room.lastMessageTime)}
                        />

                        {index !== chats.length - 1 && (
                          <div className="w-full mt-3 border border-black/55 dark:border-[#AEAEAE]/55" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/*
          
          Chat room

          */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#ffffff] dark:bg-[#333333] transition-transform duration-300 ease-out ${
          chatSelected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {chatSelected && (
          <div className="h-full">
            <ChatRoom
              room={chatSelected}
              onClick={() => setChatSelected("")}
              participant={userSelected}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreenMobile;
