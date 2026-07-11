import { IoPerson } from "react-icons/io5";
import PlaceHolderPFP from "../assets/Placeholder-Progile-Image.webp";
import type { ChatCardProps } from "../interfaces/ComponentsInterface";

const ChatCard = ({
  chatterAvatarURL,
  chatterEmail,
  chatterName,
  chatterLastMessage,
  lastMessageTime,
}: ChatCardProps) => {
  return (
    //Container
    <div className="w-full flex justify-between cursor-pointer">
      {/* Add room id as a key to every chat card */}
      {/*
        
        Chatter pfp,
        Chatter Name,
        Chatter last message
        
        */}
      <div className="flex items-center">
        {chatterAvatarURL != null ? (
          <img
            src={chatterAvatarURL}
            className="w-[3.5vw] h-[3.5vw] min-w-9 min-h-9 border border-black/55 rounded-full self-center"
          />
        ) : (
          <div className="w-[3.5vw] h-[3.5vw] min-w-9 min-h-9 border border-black/55 dark:border-white/45 rounded-full flex justify-center items-center">
            <IoPerson size="2.5vw" color="#999393"/>
          </div>
        )}
        {/* Chatter name and last sent message part */}
        <div className="flex flex-col justify-center ml-1 xl:ml-2 text-[clamp(1rem,1.5vw,2rem)] text-text-light dark:text-text-dark">
          <p className="font-bold">
            {chatterName == null ? chatterEmail : chatterName}
          </p>
          <p className="text-[#4B4B4B] dark:text-[#979797] overflow-x-hidden">
            {chatterLastMessage}
          </p>
        </div>
      </div>

      {/*
        
        Last sent message time
        
        */}
      <div className=" text-[clamp(1rem,1.5vw,2rem)] text-text-light dark:text-text-dark">
        <p>{lastMessageTime}</p>
      </div>
    </div>
  );
};

export default ChatCard;
