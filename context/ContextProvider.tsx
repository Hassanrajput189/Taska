"use client";

import { useState,useEffect} from "react";
import context from "./context";
import { task_info, user_data } from "@/interfaces";
import { useRouter} from "next/navigation";


const ContextProvider = ({ children }: { children: React.ReactNode }) => {
const [userName,setUserName] = useState<string|null>(null)
const [userEmail,setUserEmail] = useState<string|null>(null)
const [tasks, setTasks] = useState<task_info[]|null>([]);
const [assignees,setAssignees] = useState<user_data[]|null>([])
const [selectedTask, setSelectedTask] = useState<task_info | null>(null);
const [allTasks,setAllTasks] = useState<task_info[]|null>(tasks)
const [showTask,setShowTask] = useState<boolean|null>(false)
const [showEditCard, setShowEditCard] = useState<boolean|null>(false);
const [showSideBar, setShowSideBar] = useState<boolean|null>(false);
const [isAdmin,setIsAdmin] = useState<boolean|null>(false)
const router = useRouter()



  return (    
    <context.Provider
      value={{        
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        tasks,        
        setTasks,        
        assignees,
        setAssignees,
        showTask,
        setShowTask,
        selectedTask,
        setSelectedTask, 
        allTasks,
        setAllTasks,       
        showEditCard,
        setShowEditCard,
        showSideBar,
        setShowSideBar,        
        isAdmin,
        setIsAdmin,        
        router,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ContextProvider;