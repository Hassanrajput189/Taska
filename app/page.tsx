"use client";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TaskCard from "./components/TaskCard";
import { useContext, useEffect } from "react";
import context from "@/context/context";
import axios from "axios";
import toast from "react-hot-toast";
import EditCard from "./components/EditCard";
import SideBar from "./components/SideBar";

export default function Main() {
  const {
    showTask,
    showEditCard,
    selectedTask,
    router,
    showSideBar,
    setIsAdmin,
  } = useContext(context);

  const handleRedirect = async () => {
    try {      
      const email = localStorage.getItem("email");
      if (!email) {        
        router.push("/login");
        return false;
      }
      
      const response = await axios.get("/api/auth/verify", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = response.data;

      if (data.status === 401 || data.status === 500) {
        toast.error(data.message || "Authentication failed");
        router.push("/login");
        return false;
      }

      return true;
    } catch (error) {      
      toast.error("Authentication failed");
      router.push("/login");
      return false;
    }
  };

  const handleRole = async () => {
    const email = localStorage.getItem("email");
      
      const response = await axios.post(
        "/api/auth/role",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data.status === 200) {
        setIsAdmin(data.isAdmin);        
      }
    
  };

  useEffect(() => {
    const authenticate = async () => {
      const authenticated = await handleRedirect();

      if (authenticated) {
        await handleRole();
      }
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
            <Home />
          </div>
        </div>
      </div>

      {showTask && selectedTask && (
        <div className="fixed z-50 w-full top-0">
          <TaskCard {...selectedTask} />
        </div>
      )}

      {showEditCard && selectedTask && (
        <div className="fixed z-50 w-full top-0">
          <EditCard {...selectedTask} />
        </div>
      )}
    </div>
  );
}
