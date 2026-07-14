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
import type { Session } from "@supabase/supabase-js";
import type { Chats } from "../interfaces/ComponentsInterface";

const ChatScreen = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  //User State
  const [userSession, setUserSession] = useState<Session | null>(null);

  //Chat state
  const [chats, setChats] = useState<Chats[]>([]);
  const [chatSelected, setChatSelected] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<SearchedUsers[]>([]);
  const [userSelected, setUserSelected] = useState<SearchedUsers>();
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

  //useEffect for re-sizing the window
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

  if (isValidating) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" color="border-[#000000]" />
      </div>
    );
  }

  //Function for formating time
  const formatTime = (timestamp: string): string => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
                                setChatSelected('1');
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
                        {chats.map(( room ) => (
                          <div key={room.channel_id} className="">
                            <ChatCard
                              chatterAvatarURL={null}
                              chatterEmail={room.otherPerson?.user_email ?? ""}
                              chatterLastMessage={room.lastMessage}
                              lastMessageTime={formatTime(room.lastMessageTime)}
                            />
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
          
          The chat itself

          */}
          <div className="flex-1 ml-3 mt-2">
            {chatSelected ? (
              <div className="h-full">
                <ChatRoom room={chatSelected} participant={userSelected} />
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <IoMdChatbubbles
                  size="9vw"
                  color={isDarkMode ? "#ffffff" : "#000000"}
                />
                <p className="text-[clamp(15px,2vw,200px)] text-text-light dark:text-text-dark">
                  Choose a room to start chatting!
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
