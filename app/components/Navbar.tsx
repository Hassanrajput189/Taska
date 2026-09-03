"use client";
import axios from "axios"
import context from "@/context/context";
import { useContext } from "react";
import toast from "react-hot-toast";


const Navbar = () => {
  const {router,setTasks,setAllTasks,setSelectedTask,setIsAdmin,setShowSideBar,showSideBar,setAssignees,setShowTask,setShowEditCard} = useContext(context)
  const reset = ()=>{
      localStorage.removeItem("name");
      localStorage.removeItem("email")        
        setTasks([])
        setAllTasks([])
        setSelectedTask([])        
        setAssignees([])    
        setShowTask(false)
        setShowEditCard(false)    
        setShowSideBar(false)
        setIsAdmin(false)
        }
  

  const handleLogout = async () => {    
    
      const response = await axios.get(
        `/api/auth/logout`,        
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      const data = response.data;      
      if (data["status"] === 200) {        
        reset()
        toast.success(data["message"])                
        router.push("/login");
      } else { 
        toast.error(data["message"])
      }
    

  };
  return (
    <nav className="flex justify-between bg-white py-4 px-4">
      <div className="logo flex justify-center items-center gap-2">
        <div onClick={()=>{          
          setShowSideBar(!showSideBar)
        }}>
          <svg 
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 1.375C0 0.614453 0.638393 0 1.42857 0H18.5714C19.3616 0 20 0.614453 20 1.375C20 2.13555 19.3616 2.75 18.5714 2.75H1.42857C0.638393 2.75 0 2.13555 0 1.375ZM0 8.25C0 7.48945 0.638393 6.875 1.42857 6.875H18.5714C19.3616 6.875 20 7.48945 20 8.25C20 9.01055 19.3616 9.625 18.5714 9.625H1.42857C0.638393 9.625 0 9.01055 0 8.25ZM20 15.125C20 15.8855 19.3616 16.5 18.5714 16.5H1.42857C0.638393 16.5 0 15.8855 0 15.125C0 14.3645 0.638393 13.75 1.42857 13.75H18.5714C19.3616 13.75 20 14.3645 20 15.125Z"
              fill="#141522"
            />
          </svg>
        </div>
        <div className="font-bold text-2xl">Task</div>
      </div>

      <div >
        <button 
        onClick={handleLogout}
        className="  text-white font-semibold bg-[#546FFF] cursor-pointer hover:font-bold transition-all text-md px-5 py-1 rounded-md">
          Logout
        </button>        
      </div>
    </nav>
  );
};

export default Navbar;
