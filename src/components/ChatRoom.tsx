import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import type { ChatRoomProps } from "../interfaces/ComponentsInterface";
import { IoPerson, IoSend, IoChevronBack } from "react-icons/io5";

const ChatRoom = ({ room, userName, onClick }: ChatRoomProps) => {
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

  if (width <= 450) {
    return (
      <div className="h-full py-2 flex flex-col">
        {/* 
      
      Chat header 
      
      */}
        <div className="flex items-center">
          {onClick && (
            <div onClick={onClick} className="mr-1">
              <IoChevronBack size="7vw" color={isDarkMode ? "#ffffff" : "#000000"} />
            </div>
          )}
          <div className="w-[10vw] h-[10vw] border border-black/55 dark:border-white/50 rounded-full flex items-center justify-center">
            <IoPerson size="7vw" color="#999393" />
          </div>
          <p className="ml-1 text-text-light dark:text-text-dark text-[clamp(16px,1.7vw,170px)]">
            {userName}
          </p>
        </div>
        <div className="mt-2 mx-2 border border-black/55 dark:border-white/40" />

        {/* The messages part of the chat */}
        <div className="grow-2"></div>

        {/* Input message part */}
        <div className="flex items-center px-1">
          <form className="grow-2">
            <input className="w-full h-[8vw] pl-1 border border-black/60 rounded-xl bg-input-light" />
          </form>
          <div className="w-[9vw] h-[9vw] ml-1 border border-black/55 rounded-full bg-input-light flex justify-center items-center">
            <IoSend size="4vw" />
          </div>
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
            {userName}
          </p>
        </div>
        <div className="mt-2 border border-black/55 dark:border-white/40" />

        {/* The messages part of the chat */}
        <div className="grow-2"></div>

        {/* Input message part */}
        <div className="flex items-center">
          <form className="grow-2">
            <input className="w-full h-[3vw] pl-1 border border-black/60 rounded-xl bg-input-light" />
          </form>
          <div className="w-[3vw] h-[3vw] min-w-7 min-h-7 ml-1 border border-black/55 rounded-full bg-input-light flex justify-center items-center">
            <IoSend size="1.7vw" />
          </div>
        </div>
      </div>
    );
  }
};

export default ChatRoom;
