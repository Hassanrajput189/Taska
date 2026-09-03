"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import context from "@/context/context";
import { task_info } from "@/interfaces";
import toast from "react-hot-toast";

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

const Tasks = () => {
  const {
    tasks,
    setTasks,
    setShowTask,
    setSelectedTask,
    setShowEditCard,
    setAllTasks,
    setAssignees,
    isAdmin,
    assignees,
  } = useContext(context);
  

  useEffect(() => {
    const email = localStorage.getItem("email")
    if (!email) return;

    const fetchData = async () => {
      if (isAdmin) {
        
        await handleAssigneeFetch();
      } else {
        
        await handleTaskFetch();
      }
    };

    fetchData();
  }, [isAdmin]);

  
  useEffect(() => {
    if (isAdmin && assignees && assignees.length > 0) {
      handleAdminDateFetch();
    }
  }, [assignees, isAdmin]);

  const handleTaskFetch = async () => {
    const email = localStorage.getItem("email")
    try {
      const response = await axios.post("/api/task/read", {
        assign: email,
      });
      
      const data = response.data;
      console.log("tasks" ,data.tasks)
      if (data.status === 200 && data.tasks.length > 0) {
        setTasks(data.tasks);
        setAllTasks(data.tasks);
      } else {
        setTasks([]);
        setAllTasks([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };
  
  const handleAdminDateFetch = async () => {
    try {
      const response = await axios.post("/api/task/admin/read", {
        assignees,
      });

      const data = response.data;
      console.log("all tasks",data.tasks)
      if (data.status === 200) {
        setTasks(data.tasks);
        setAllTasks(data.tasks);
      } else {
        setTasks([]);
        setAllTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch admin tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  const handleAssigneeFetch = async () => {
    try {
      const response = await axios.post("/api/task/admin/assignees");

      const data = response.data;
      console.log("assignees ",data.data)
      if (data.status === 200) {
        setAssignees(data.data);
      }      
    } catch (error) {
      console.error("Failed to fetch assignees:", error);
      toast.error("Failed to fetch assignees");      
    }
  };
  
  const handleTaskDelete = async (title?: string, assign?: string) => {

      const response = await axios.delete("/api/task/admin/delete", {
        data: {
          title,
          assign,
        },
      });

      const data = response.data;

      if (data.status === 200) {
        setTasks((prev: task_info[]) =>
          prev.filter((task) => task.title !== title),
        );
        setAllTasks((prev: task_info[]) =>
          prev.filter((task) => task.title !== title),
        );

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

  };

  return (
    <div className="border border-[#D7D7D7] rounded-lg px-4 bg-[#FFFFFF]">
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_0.8fr] items-center p-3 text-[#656F7D]">
        <div>Name</div>
        <div>Due_date</div>
        <div>Assignee</div>
        <div>Priority</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      {tasks && tasks.length > 0 ? (
        tasks.map((task: task_info, index: number) => (
          <div
            key={index}
            onClick={() => {
              setShowTask(true);
              setSelectedTask({
                title: task.title,
                due_date:
                  task.due_date &&
                  new Date(task.due_date).toISOString().split("T")[0],
                priority: task.priority,
                status: task.status,
                assign: task.assign,
                desc: task.desc,
                email: task.email,
              });
            }}
            className="grid grid-cols-1 sm:grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_0.8fr] items-center p-4 border-t border-[#D7D7D7] cursor-pointer gap-2"
          >
            <div className="text-[#546FFF] font-semibold">{task.title}</div>
            <div className="font-semibold">
              {task.due_date &&
                new Date(task.due_date).toISOString().split("T")[0]}
            </div>

            <div className="font-semibold">{task.assign}</div>

            <div className="flex items-center gap-2">
              <div>
                <img src={`${getPriorityFlag(task.priority)}`} alt="flag" />
              </div>
              <div className="font-semibold">{task.priority}</div>
            </div>

            <div>
              <span
                className={`${getStatusClass(task.status)} pb-1 px-3 text-white rounded-md`}
              >
                {task.status}
              </span>
            </div>

            {isAdmin ? (
              <div className="flex gap-3 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskDelete(task.title, task.assign);
                  }}
                  className="cursor-pointer hover:scale-110 transition-all duration-200"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 3.33333H14.9166C14.7232 2.39284 14.2115 1.54779 13.4677 0.940598C12.7239 0.333408 11.7935 0.0012121 10.8333 0H9.16663C8.20646 0.0012121 7.27606 0.333408 6.53225 0.940598C5.78844 1.54779 5.27671 2.39284 5.08329 3.33333H2.49996C2.27895 3.33333 2.06698 3.42113 1.9107 3.57741C1.75442 3.73369 1.66663 3.94565 1.66663 4.16667C1.66663 4.38768 1.75442 4.59964 1.9107 4.75592C2.06698 4.9122 2.27895 5 2.49996 5H3.33329V15.8333C3.33462 16.938 3.77403 17.997 4.55514 18.7782C5.33626 19.5593 6.3953 19.9987 7.49996 20H12.5C13.6046 19.9987 14.6637 19.5593 15.4448 18.7782C16.2259 17.997 16.6653 16.938 16.6666 15.8333V5H17.5C17.721 5 17.9329 4.9122 18.0892 4.75592C18.2455 4.59964 18.3333 4.38768 18.3333 4.16667C18.3333 3.94565 18.2455 3.73369 18.0892 3.57741C17.9329 3.42113 17.721 3.33333 17.5 3.33333ZM9.16663 1.66667H10.8333C11.3502 1.6673 11.8542 1.82781 12.2763 2.1262C12.6984 2.42459 13.0178 2.84624 13.1908 3.33333H6.80913C6.98211 2.84624 7.30154 2.42459 7.72361 2.1262C8.14569 1.82781 8.64973 1.6673 9.16663 1.66667ZM15 15.8333C15 16.4964 14.7366 17.1323 14.2677 17.6011C13.7989 18.0699 13.163 18.3333 12.5 18.3333H7.49996C6.83692 18.3333 6.20103 18.0699 5.73219 17.6011C5.26335 17.1323 4.99996 16.4964 4.99996 15.8333V5H15V15.8333Z"
                      fill="#F25353"
                    />
                    <path
                      d="M8.33333 14.9999C8.55435 14.9999 8.76631 14.9121 8.92259 14.7558C9.07887 14.5996 9.16667 14.3876 9.16667 14.1666V9.16659C9.16667 8.94557 9.07887 8.73361 8.92259 8.57733C8.76631 8.42105 8.55435 8.33325 8.33333 8.33325C8.11232 8.33325 7.90036 8.42105 7.74408 8.57733C7.5878 8.73361 7.5 8.94557 7.5 9.16659V14.1666C7.5 14.3876 7.5878 14.5996 7.74408 14.7558C7.90036 14.9121 8.11232 14.9999 8.33333 14.9999Z"
                      fill="#F25353"
                    />
                    <path
                      d="M11.6667 14.9999C11.8877 14.9999 12.0997 14.9121 12.256 14.7558C12.4122 14.5996 12.5 14.3876 12.5 14.1666V9.16659C12.5 8.94557 12.4122 8.73361 12.256 8.57733C12.0997 8.42105 11.8877 8.33325 11.6667 8.33325C11.4457 8.33325 11.2337 8.42105 11.0775 8.57733C10.9212 8.73361 10.8334 8.94557 10.8334 9.16659V14.1666C10.8334 14.3876 10.9212 14.5996 11.0775 14.7558C11.2337 14.9121 11.4457 14.9999 11.6667 14.9999Z"
                      fill="#F25353"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask({
                      title: task.title,
                      due_date:
                        task.due_date &&
                        new Date(task.due_date).toISOString().split("T")[0],
                      priority: task.priority,
                      status: task.status,
                      assign: task.assign,
                      desc: task.desc,
                      email: task.email,
                    });
                    setShowEditCard(true);
                  }}
                  className="cursor-pointer hover:scale-110 transition-all duration-200"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.21 18.08 4 19l.92-4.21L16.862 3.487Z"
                      stroke="#546FFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.5 4.85 19.15 8.5"
                      stroke="#546FFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask({
                    title: task.title,
                    due_date:
                      task.due_date &&
                      new Date(task.due_date).toISOString().split("T")[0],
                    priority: task.priority,
                    status: task.status,
                    assign: task.assign,
                    desc: task.desc,
                    email: task.email,
                  });
                  setShowEditCard(true);
                }}
                className="cursor-pointer hover:scale-110 transition-all duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.21 18.08 4 19l.92-4.21L16.862 3.487Z"
                    stroke="#546FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5 4.85 19.15 8.5"
                    stroke="#546FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-5">No tasks found</div>
      )}
    </div>
  );
};

export default Tasks;
