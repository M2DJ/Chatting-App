import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import type { ChatRoomProps } from "../interfaces/ComponentsInterface";
import { IoPerson, IoSend, IoChevronBack } from "react-icons/io5";
import { channelService } from "../services/ChannelService";
import { authService } from "../services/AuthService";
import type { Session } from "@supabase/supabase-js";

const ChatRoom = ({ room, participant, onClick }: ChatRoomProps) => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  //Message state
  const [inputValue, setInputValue] = useState("");
  const [newMessage, setNewMessage] = useState<string[]>([]);
  const [user, setUser] = useState<Session | null>(null);

  const hasSentMessage = useRef(false);

  //useEffect for getting the user session
  useEffect(() => {
    const getUser = async () => {
      try {
        const { success, data } = await authService.currentSession();

        if (success) {
          setUser(data!.session);
        }
      } catch (e) {
        console.error("Failed fetching user session: ", e);
      }
    };

    getUser();
  }, []);

  const handleSendingMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    let newestMessage = inputValue.trim();
    if (!newestMessage) return;

    setNewMessage((prevMessages) => [...prevMessages, newestMessage]);

    if (hasSentMessage.current) {
      try {
        const { error } = await channelService.createRoom(
          user?.user.id!,
          user?.user.email!,
          participant?.user_id!,
          participant?.user_email!,
          user?.user.id!,
          newestMessage,
        );

        if (error) {
          console.error("Error occured in the 'ChatRoom' component: ", error);
        }

        console.log("Message saved successfuly");
      } catch (e) {
        console.error('Error creating room in "ChatRoom" component: ', e);
      }
    }

    setInputValue("");
  };

  if (width <= 450) {
    return (
      <div className="h-full py-2 flex flex-col">
        {/* 
      
      Chat header 
      
      */}
        <div className="flex items-center">
          {onClick && (
            <div onClick={onClick} className="mr-1">
              <IoChevronBack
                size="7vw"
                color={isDarkMode ? "#ffffff" : "#000000"}
              />
            </div>
          )}
          <div className="w-[10vw] h-[10vw] border border-black/55 dark:border-white/50 rounded-full flex items-center justify-center">
            <IoPerson size="7vw" color="#999393" />
          </div>
          <p className="ml-1 text-text-light dark:text-text-dark text-[clamp(16px,1.7vw,170px)]">
            {participant?.user_name == null
              ? participant?.user_email
              : participant.user_name}
          </p>
        </div>
        <div className="mt-2 mx-2 border border-black/55 dark:border-white/40" />

        {/* The messages part of the chat */}
        <div className="grow-2">
          {/*
          
          How the text message will look
          
          */}
          <div className="">{newMessage}</div>
        </div>

        {/* Input message part */}
        <div className="">
          <form
            className="flex items-center px-1"
            onSubmit={handleSendingMessage}
          >
            <input
              value={inputValue}
              onChange={(e) => {
                hasSentMessage.current = true;
                setInputValue(e.target.value);
              }}
              type="text"
              className="focus:outline-none w-full h-[8vw] pl-1 border border-black/60 rounded-xl bg-input-light"
            />
            <div className="cursor-pointer w-[9vw] h-[9vw] ml-1 border border-black/55 rounded-full bg-input-light flex justify-center items-center">
              <IoSend size="4vw" />
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full py-2 flex flex-col">
        {/* 
      
      Chat header 
      
      */}
        <div className="flex items-center">
          {onClick && (
            <div onClick={onClick}>
              <IoChevronBack color={isDarkMode ? "#ffffff" : "#000000"} />
            </div>
          )}
          <div className="w-[4.3vw] h-[4.3vw] border border-black/55 dark:border-white/50 rounded-full flex items-center justify-center">
            <IoPerson size="3vw" color="#999393" />
          </div>
          <p className="ml-1 text-text-light dark:text-text-dark text-[clamp(16px,1.7vw,170px)]">
            {participant?.user_name == null
              ? participant?.user_email
              : participant.user_name}
          </p>
        </div>
        <div className="mt-2 border border-black/55 dark:border-white/40" />

        {/* The messages part of the chat */}
        <div className="grow-2">
          {/*
          
          How the text message will look
          
          */}
          <div className="">
            {newMessage.map((msg, index) => (
              <p
                key={index}
                className={`mt-2 bg-[#BDBDBD] max-w-[40vw] h-fit p-1 rounded-l-xl rounded-br-xl break-all whitespace-pre-wrap`}
              >
                {msg}
              </p>
            ))}
          </div>
        </div>

        {/* Input message part */}
        <div className="">
          <form
            className="flex justify-center items-center"
            onSubmit={handleSendingMessage}
          >
            <input
              value={inputValue}
              onChange={(e) => {
                hasSentMessage.current = true;
                setInputValue(e.target.value);
              }}
              type="text"
              className="focus:outline-none w-full h-[3vw] pl-1 border border-black/60 rounded-xl bg-input-light grow-2"
            />
            <button className="cursor-pointer w-[3vw] h-[3vw] min-w-7 min-h-7 ml-1 border border-black/55 rounded-full bg-input-light flex justify-center items-center">
              <IoSend size="1.7vw" />
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default ChatRoom;
