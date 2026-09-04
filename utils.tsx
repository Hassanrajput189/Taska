import context from "@/context/context"
import { SetStateAction, useContext } from "react";
import axios from "axios"
import { task_info ,user_data} from "./interfaces";


export const handleAssigneeFetch = async (
  setAssignees: React.Dispatch<SetStateAction<user_data[] | null>>,      
) => {        
    const response = await axios.post("/api/task/admin/assignees");

    const data = response.data;
    console.log("assignees from handle is ", data.data,data.status)

    if (data.status === 200) {
      setAssignees(data.data);
      return data.data
    }
    return []
  };




  export const handleAdminDateFetch = async (
    assignees:user_data[],
    setTasks: React.Dispatch<SetStateAction<task_info[] | null>>,    
  )=> {
    
    const response = await axios.post("/api/task/admin/read", {
      assignees,
    });

    const data = response.data;
    if (data.status === 200) {
      setTasks(data.tasks);      
      return data.tasks
    } else {
      setTasks([]);    
      return []  
    }    
  };

    export const handleTaskFetch = async (
      email:String,
      setTasks: React.Dispatch<SetStateAction<task_info[] | null>>,      
    ) => {    
    const response = await axios.post("/api/task/read", {
      assign: email,
    });

    const data = response.data;
    if (data.status === 200 && data.tasks.length > 0) {
      setTasks(data.tasks);      
      return data.tasks
    } else {
      setTasks([]);
      return [] 
    }
  };


export const getStatusClass = (status?: string) => {
  const lowerStatus = status?.toLocaleLowerCase();
  switch (lowerStatus) {
    case "pending":
      return "bg-yellow-500";

    case "active":
      return "bg-green-500 ";

    case "closed":
      return "bg-red-500 ";

    default:
      return "bg-gray-300 text-black";
  }
};
export const getPriorityFlag = (priority?: string) => {
  const lowerPriority = priority?.toLowerCase();
  switch (lowerPriority) {
    case "low":
      return "yellowFlag.svg";

    case "normal":
      return "greenFlag.svg";

    case "high":
      return "redFlag.svg";

    default:
      return "window.svg";
  }
};
