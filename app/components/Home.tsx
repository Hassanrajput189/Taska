"use client";

import Tasks from "./Tasks";
import context from "@/context/context";
import { useContext, useState ,useEffect} from "react";
import axios from "axios";
import Users from "./Users";
import toast from "react-hot-toast";
import { user_data } from "@/interfaces";
import {
  handleTaskFetch,
  handleAssigneeFetch,
  handleUserFetch,
  handleAdminDataFetch,
} from "@/utils";

export default function Home() {
  const { 
    router, 
    isAdmin, 
    module, 
    setShowCreateUserCard,
    setAssignees,
    setUsers,
    setTasks,
    assignees,
    setIsAdmin,
    userEmail,
    setShowSideBar,
   } =
    useContext(context);
  const [allTasks, setAllTasks] = useState([]);
  const [allUsers, setAllUsers] = useState<user_data[] | null>([]);
  const [timer,setTimer]  = useState<NodeJS.Timeout|null>(null)    
  const getModule = (module: string) => {
    switch (module) {
      case "task":
        return <Tasks />;

      case "user":
        return <Users />;

      default:
        return <Tasks />;
    }
  };
  const handleCheckAdmin = async (email: string) => {
    try {
      const response = await axios.post(
        "/api/auth/isAdmin",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      setIsAdmin(false)
    }
  };

  const handleTaskSearch = async (value: string) => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(async () => {
        const response = await axios.post(`/api/task/search?query=${value}`, {
          email: userEmail,
        });
        const data = response.data;
        if (data.status === 404) {
          setTasks([]);
        } else if (data.status === 200) {
          setTasks(data.tasks);
        } else {
          setTasks(allTasks);
        }
      }, 500),
    );
  };

  const handleUserSearch = async (value: string) => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(async () => {
        const response = await axios.post(
          `/api/users/admin/search?query=${value}`,
          {
            email: userEmail,
          },
        );
        const data = response.data;
        if (data.status === 404) {
          setUsers([]);
        } else if (data.status === 200) {
          setUsers(data.users);
        } else {
          setUsers(allUsers);
        }
      }, 500),
    );
  };
  useEffect(() => {
    if (!userEmail) return;

    const authenticate = async () => {
      await handleCheckAdmin(userEmail);
    };

    authenticate();
    
  }, [isAdmin, userEmail]);
  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      
      if (isAdmin) {
        await handleAssigneeFetch(userEmail, setAssignees);
        const value_users = await handleUserFetch(userEmail, setUsers);
        
        setAllUsers(value_users);
      } else {
        const value_tasks = await handleTaskFetch(userEmail, setTasks);
        
        setAllTasks(value_tasks);
      }
    };

    fetchData();
  }, [isAdmin, router, userEmail]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      
      if (isAdmin && assignees && assignees.length > 0) {
      
        const value_tasks = await handleAdminDataFetch(userEmail, setTasks);
      

        setAllTasks(value_tasks);
      }
    };

    fetchData();
  }, [assignees, isAdmin, router, userEmail]);

  return (
    <div className="p-5 min-h-[80vh] flex flex-col gap-4 overflow-y-auto bg-gray-100 w-full h-full">
      <div className="flex justify-between items-center gap-4">
        {module === "task" && (
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
        )}

        {isAdmin && module === "user" && (
          <div className="flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search user..."
              onChange={(e) => handleUserSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       outline-none focus:ring-2 focus:ring-indigo-500 
                       bg-white"
            />
          </div>
        )}

        {isAdmin && module === "task" && (
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
        {isAdmin && module === "user" && (
          <div>
            <button
              onClick={() => {
                setShowCreateUserCard(true);
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

      <div>{getModule(module)}</div>
    </div>
  );
}
