import PlaceHolderPerson from "../assets/Placeholder-Progile-Image.webp";
import NightMode from "../assets/Toggle-Night.jpg";
import Search from "../assets/Search-Icon.jpg";
import { useEffect, useState } from "react";
import ChatCard from "../components/ChatCard";

const ChatScreenMobile = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  return (
    <div className="h-screen font-inter px-[10px]">
      {/*
      
      Left side of the dashboard
      
      */}
      <div className="h-screen min-w-40">
        {/*
          
          Container that holds the margin for the left side
          
          */}
        <div className="mt-2">
          {/*
            
            Header part with the search bar
            
            */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-bold text-[clamp(1.5rem,2.8vw,5.5rem)]">
              Chatting App
            </h1>
            <div className="flex items-center">
              <div
                className="cursor-pointer w-[8vw] h-[8vw] border border-black/55 shadow-lg rounded-full bg-no-repeat bg-center bg-[length:70%] mr-3"
                style={{ backgroundImage: `url(${NightMode})` }}
              />
              <div
                onClick={() => {}}
                className="cursor-pointer w-[11vw] h-[11vw] shadow-lg border border-black/55 rounded-full bg-center bg-no-repeat bg-[length:90%]"
                style={{ backgroundImage: `url(${PlaceHolderPerson})` }}
              />
            </div>
          </div>

          {/*
            
            Chat Search Bar
            
            */}
          <div className="relative mb-5">
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
          
          Chat Cards
          
          */}
          <ChatCard />
        </div>
      </div>
    </div>
  );
};

export default ChatScreenMobile;
