import { IoPerson } from "react-icons/io5";
import type { ChatCardSearchProps } from "../interfaces/ComponentsInterface";

const ChatCardSearch = ({userName}: ChatCardSearchProps) => {
  return (
    <div className="w-full flex justify-between cursor-pointer">
      {/* Add room id as a key to every chat card */}
      {/*
        
        Chatter pfp,
        Chatter Name,
        Chatter last message
        
        */}
      <div className="flex">
        <div className="w-[3.5vw] h-[3.5vw] min-w-9 min-h-9 border border-black/55 dark:border-white/45 rounded-full flex flex-col justify-center items-center">
            <IoPerson size="2vw" color="#999393"/>
        </div>
        {/* Chatter name and last sent message part */}
        <div className="flex flex-col justify-center ml-2 text-[clamp(1rem,1.5vw,2rem)] text-text-light dark:text-text-dark">
          <p className="font-bold">{userName}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatCardSearch;
