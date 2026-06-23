import Facebook from '../assets/Facebook-Logo.png';
import Google from '../assets/Google-Logo.webp';
import X from '../assets/X-Logo.png';

const LoginPage = () => {
  return (
    <div className="h-screen bg-linear-[90deg,#ffffff_0%,#999999_87%]">
      <div className="h-full flex justify-center items-center">
        <div className="w-[40%] min-w-90 py-5 px-3 bg-white rounded-lg shadow-lg font-lalezar">
          {/* 

            Header of the form
          
          */}
          <p className="flex justify-center mb-6 text-[clamp(40px,2vw,150px)]">
            Login
          </p>

          {/*
          
            Form element

          */}
          <form className="mb-3">
            <label className="text-[clamp(16px,1.5vw,90px)]">Email</label>
            <br />
            <input className="h-[5vh] min-h-10 max-h-80 w-full border text-[clamp(16px,1.25vw,80px)] border-black/55 rounded-xl pl-2 mb-4" />
            <label className="text-[clamp(16px,1.5vw,90px)]">Password</label>
            <br />
            <input className="h-[5vh] min-h-10 max-h-80 w-full text-[clamp(16px,1.25vw,80px)] border border-black/55 rounded-xl pl-2 mb-4" />

            <div className="flex justify-end mb-8">
              <button className="cursor-pointer text-[clamp(16px,1.5vw,90px)]">
                Forgot Password?
              </button>
            </div>

            <div className="flex justify-center">
              <button className="cursor-pointer py-2 w-full text-[1.9em] sm:max-w-[50%] md:max-w-[60%] lg:max-w-[60%] border border-black/50 rounded-md bg-linear-[90deg,#ffffff_0%,#999999_87%]">
                Login
              </button>
            </div>
          </form>

          {/*
          
          Navigate to the Sign Up screen
          
          */}
          <div className="flex justify-center mb-2 font-inter text-[clamp(16px,1vw,100px)]">
            <p className="mr-1">Don't have an account?</p>
            <button className="cursor-pointer text-blue-700">Sign up</button>
          </div>

          {/*
            
          Other login methods section
            
          */}
          <div className="flex justify-around items-center mb-5">
            <div className="h-0.5 w-[40%] bg-black" />

            <p className="text-[clamp(16px,1.5vw,90px)]">OR</p>

            <div className="h-0.5 w-[40%] bg-black" />
          </div>

          <div className="flex justify-around items-center">
            <div 
            className="w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-[length:60%] bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${X})`}}
            />

            <div 
            className="w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-[length:120%] bg-center bg-no-repeat" 
            style={{backgroundImage: `url(${Facebook})`}}
            />

            <div 
            className="w-[6vw] h-[6vw] min-w-15 min-h-15 border rounded-full shadow-[0_4px_12px_0_#00000075] bg-contain" 
            style={{backgroundImage: `url(${Google})`}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
