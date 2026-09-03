"use client";

import Tasks from "./Tasks";
import context from "@/context/context";
import { useContext, useState } from "react";
import axios from "axios";



export default function Home() {
  const { router, setTasks,allTasks,isAdmin } = useContext(context);
  const [timer,setTimer]  = useState<NodeJS.Timeout|null>(null)  


  const handleSearch = async (value: string) => {
      const email = localStorage.getItem("email")
    
    if(timer){
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(async()=>{      
      const response = await axios.post(
        `/api/task/search?query=${value}`,{
        email
      }
      );
      const data = response.data            
      if(data.status === 404){        
        setTasks([])        
      }
      else if(data.status === 200){
        setTasks(data.tasks)
      }
      else{
        setTasks(allTasks)
      }
    
    },500)
    )
    

  };
  

  return (
    <div className="p-5 min-h-[80vh] flex flex-col gap-4 overflow-y-auto bg-gray-100 w-full h-full">

      <div className="flex justify-between items-center gap-4">

        
        <div className="flex-1 max-w-xl">          
          <input
            type="text"
            placeholder="Search tasks..."                 
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       outline-none focus:ring-2 focus:ring-indigo-500 
                       bg-white"
          />

          
        </div>
        {isAdmin && (
          <div>
          <button
            onClick={() => {              
              router.push("/create_task");
            }}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg 
                       font-semibold hover:bg-indigo-700 
                       transition-all duration-200"
          >
            Create New Task
          </button>
          
        </div>
        )}
        

      </div>
      
      <div>
        <Tasks />
      </div>

    </div>
  );
}