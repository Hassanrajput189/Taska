"use client";

import { useState} from "react";
import context from "./context";
import { task_info, user_data } from "@/interfaces";
import { useRouter} from "next/navigation";



const ContextProvider = ({ children }: { children: React.ReactNode }) => {
const [userName,setUserName] = useState<string>("")
const [userEmail,setUserEmail] = useState<string>("")
const [adminEmail,setAdminEmail] = useState<string>("")
const [tasks, setTasks] = useState<task_info[]>([]);
const [users,setUsers] = useState<user_data[]>([]);
const [isAdmin,setIsAdmin] = useState<boolean>(false)
const [assignees,setAssignees] = useState<user_data[]>([])
const [selectedTask, setSelectedTask] = useState<task_info>({});
const [selectedUser, setSelectedUser] = useState<user_data >({});
const [showTask,setShowTask] = useState<boolean>(false)
const [showTaskEditCard, setShowTaskEditCard] = useState<boolean>(false);
const [showUserEditCard, setShowUserEditCard] = useState<boolean>(false);
const [showAssignTaskCard, setShowAssignTaskCard] = useState<boolean>(false);
const [showSideBar, setShowSideBar] = useState<boolean>(false);
const [showCreateUserCard,setShowCreateUserCard] = useState<boolean>(false)
const [showUserPermissionCard,setShowUserPermissionCard] = useState<boolean>(false)
const [permission,setPermission] = useState<string>("") 
const [module,setModule] = useState<string>("task")
const [loading,setLoading] = useState<boolean>(false)
const roles = [
    "Manager",
    "Doctor",
    "Engineer",
    "Teacher",
    "Consultant",
    "Other",
  ];
const router = useRouter()



  return (    
    <context.Provider
      value={{        
        userName,
        setUserName,
        userEmail,
        setUserEmail,        
        adminEmail,
        setAdminEmail,
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
        showAssignTaskCard,
        setShowAssignTaskCard,
        permission,
        setPermission,
        showSideBar,
        setShowSideBar,        
        showUserPermissionCard,
        setShowUserPermissionCard,
        isAdmin,
        setIsAdmin,                        
        module,
        setModule,      
        showCreateUserCard,
        setShowCreateUserCard,
        loading,
        setLoading,
        roles,
        router,
      }}
    >
      {children}
    </context.Provider>
  );
};




export default ContextProvider;