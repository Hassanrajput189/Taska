"use client";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TaskCard from "./components/TaskCard";
import { useContext, useEffect } from "react";
import context from "@/context/context";
import axios from "axios";
import toast from "react-hot-toast";
import EditCard from "./components/TaskEditCard";
import UserEditCard from "./components/UserEditCard";
import SideBar from "./components/SideBar";
import CreateUserCard from "./components/CreateUserCard";


export default function Main() {
  const {
    setUserName,
    userName,
    setUserEmail,
    userEmail,
    showTask,
    showTaskEditCard,
    showUserEditCard,
    selectedTask,
    selectedUser,
    router,
    showSideBar,
    showCreateUserCard,
    
  } = useContext(context);

  const handleRedirect = async () => {
    try {
      const response = await axios.get("/api/auth/verify", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = response.data;

      if (response.status === 200) {
        router.push("/");
      } else if (response.status === 404) {
        router.push("/login");
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Authentication failed");
      router.push("/login");
    }
  };


  useEffect(() => {
    const email =
      localStorage.getItem("email") === null
        ? ""
        : localStorage.getItem("email");
    const name =
      localStorage.getItem("name") === null ? "" : localStorage.getItem("name");
    setUserName(name);
    setUserEmail(email);
    
  }, [userName, userEmail]);

  
  useEffect(() => {
    const authenticate = async () => {
      await handleRedirect();
    };

    authenticate();
  }, []);

  
  return (
    <div className="w-full">
      <div>
        <div className="flex">
          {showSideBar && (
            <div>
              <SideBar />
            </div>
          )}
          <div className="w-full">
            <Navbar />
            <Home/>
          </div>
        </div>
      </div>

      {showTask && selectedTask && (
        <div className="fixed z-50 w-full top-0">
          <TaskCard {...selectedTask} />
        </div>
      )}

      {showTaskEditCard && selectedTask && (
        <div className="fixed z-50 w-full top-0">
          <EditCard {...selectedTask} />
        </div>
      )}
      {showCreateUserCard && (
        <div className="fixed z-50 w-full top-0">
          <CreateUserCard />
        </div>
      )}
      {showUserEditCard && selectedUser && (
        <div className="fixed z-50 w-full top-0">
          <UserEditCard {...selectedUser} />
        </div>
      )}
    </div>
  );
}
