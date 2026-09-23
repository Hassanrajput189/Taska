"use client";

import { useState} from "react";
import context from "./context";
import { task_info, user_data } from "@/interfaces";
import { useRouter} from "next/navigation";


const ContextProvider = ({ children }: { children: React.ReactNode }) => {
const [userName,setUserName] = useState<string|null>(null)
const [userEmail,setUserEmail] = useState<string|null>(null)
const [tasks, setTasks] = useState<task_info[]|null>([]);
const [users,setUsers] = useState<user_data[]|null>([]);
const [assignees,setAssignees] = useState<user_data[]|null>([])
const [selectedTask, setSelectedTask] = useState<task_info | null>(null);
const [selectedUser, setSelectedUser] = useState<user_data | null>(null);
const [showTask,setShowTask] = useState<boolean|null>(false)
const [showTaskEditCard, setShowTaskEditCard] = useState<boolean|null>(false);
const [showUserEditCard, setShowUserEditCard] = useState<boolean|null>(false);
const [showSideBar, setShowSideBar] = useState<boolean|null>(false);
const [isAdmin,setIsAdmin] = useState<boolean|null>(false)
const [showCreateUserCard,setShowCreateUserCard] = useState(false)
const [module,setModule] = useState<string|null>("task")
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
        users,
        setUsers,       
        selectedUser,    
        setSelectedUser,
        assignees,
        setAssignees,        
        showTask,
        setShowTask,
        selectedTask,
        setSelectedTask,         
        showTaskEditCard,
        setShowTaskEditCard,
        showUserEditCard,
        setShowUserEditCard,
        showSideBar,
        setShowSideBar,        
        isAdmin,
        setIsAdmin,                
        module,
        setModule,      
        showCreateUserCard,
        setShowCreateUserCard,
        router,
      }}
    >
      {children}
    </context.Provider>
  );
};




export default ContextProvider;