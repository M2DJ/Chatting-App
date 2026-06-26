import PlaceHolderPFP from "../assets/Placeholder-Progile-Image.webp";

const ChatCard = () => {
  return (
    //Container
    <div className="w-full flex justify-between cursor-pointer">
      {/*
        
        Chatter pfp,
        Chatter Name,
        Chatter last message
        
        */}
      <div className="flex">
        <img
          src={PlaceHolderPFP}
          className="w-[3.5vw] h-[3.5vw] min-w-9 min-h-9 border border-black/55 rounded-full self-center"
        />
        {/* Chatter name and last sent message part */}
        <div className="flex flex-col justify-center ml-1 xl:ml-2 text-[clamp(1rem,1.5vw,2rem)]">
          <p className="font-bold">Chatter Name</p>
          <p className="text-[#4B4B4B]">Last sent message</p>
        </div>
      </div>

      {/*
        
        Last sent message time
        
        */}
      <div className=" text-[clamp(1rem,1.5vw,2rem)]">
        <p className="text-[#4B4B4B]">00:00 PM/AM</p>
      </div>
    </div>
  );
};

export default ChatCard;
