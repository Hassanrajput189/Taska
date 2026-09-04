"use client";

import Tasks from "./Tasks";
import context from "@/context/context";
import { useContext, useState,useEffect } from "react";
import axios from "axios";
import Users from "./Users";
import { handleAssigneeFetch,handleTaskFetch,handleAdminDateFetch } from "@/utils";


export default function Home() {
  const { router, setTasks,isAdmin,module,assignees,setAssignees,tasks } = useContext(context);
  const [timer,setTimer]  = useState<NodeJS.Timeout|null>(null)  
  const [allTasks,setAllTasks] = useState([])
  const [allAssignees,setAllAssignees] = useState([])
  const getModule = (module:string)=>{
    switch (module) {
    case "task":
      return <Tasks/>;

    case "user":
      return <Users/>;    

    default:
      return <Tasks/>;
  }
  }

    useEffect(() => {
      const email = localStorage.getItem("email");
      if (!email) return;
  
      const fetchData = async () => {
        if (isAdmin) {
          const value_assignees = await handleAssigneeFetch(setAssignees);
          setAllAssignees(value_assignees)          
        } else {
          const value_tasks = await handleTaskFetch(email,setTasks);
          setAllTasks(value_tasks)
        }
      };
  
      fetchData();
    }, [isAdmin]);
  
    useEffect(() => {
  const fetchData = async () => {
    if (isAdmin && assignees && assignees.length > 0) {
      const value_tasks = await handleAdminDateFetch(
        assignees,
        setTasks
      );

      setAllTasks(value_tasks);
    }
  };

  fetchData();
}, [assignees, isAdmin]);
  
  
  const handleTaskSearch = async (value: string) => {
      const email = localStorage.getItem("email")      
      console.log("allTasks is ",allTasks)
      console.log("tasks is ",tasks)
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

  const handleUserSearch = async (value: string) => {    
    console.log("all assign is ",allAssignees)
    console.log("assign is ",assignees)
      const email = localStorage.getItem("email")
    
    if(timer){
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(async()=>{      
      const response = await axios.post(
        `/api/users/admin/search?query=${value}`,{
        email
      }
      );
      const data = response.data            
      if(data.status === 404){        
        setAssignees([])        
      }
      else if(data.status === 200){
        console.log("actual assignees are " ,assignees)
        setAssignees(data.users)
      }
      else{
        
        setAssignees(allAssignees)
      }
    
    },500)
    )
    

  };
  

  return (
    <div className="p-5 min-h-[80vh] flex flex-col gap-4 overflow-y-auto bg-gray-100 w-full h-full">

      <div className="flex justify-between items-center gap-4">

        
        {
          module === "task" && (
            <div className="flex-1 max-w-xl">          
          <input
            type="text"
            placeholder="Search tasks..."                 
            onChange={(e) => handleTaskSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       outline-none focus:ring-2 focus:ring-indigo-500 
                       bg-white"
          />

          
        </div>
          )
        }
        
        {
          isAdmin && module === "user" &&
          (<div className="flex-1 max-w-xl">          
          <input
            type="text"
            placeholder="Search user..."                 
            onChange={(e) => handleUserSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       outline-none focus:ring-2 focus:ring-indigo-500 
                       bg-white"
          />

          
        </div>)
        }
        
        {isAdmin && module === "task" &&(
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
        {isAdmin && module === "user" &&(
          <div>
          <button
            onClick={() => {              
              router.push("/signup");
            }}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg 
                       font-semibold hover:bg-indigo-700 
                       transition-all duration-200"
          >
            Create New User
          </button>
          
        </div>
        )}
        

      </div>
      
      <div>
        {
          getModule(module)
        }
      </div>

    </div>
  );
}