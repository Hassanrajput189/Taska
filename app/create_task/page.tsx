"use client";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import context from "@/context/context";
import toast from "react-hot-toast";
import { user_data } from "@/interfaces";
import SideBar from "../components/SideBar";

const Create_Task = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [assign, setAssign] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  const {
    assignees,
    router,
    showSideBar,
    
  } = useContext(context);

  // Access localStorage only in the browser
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleCreateTask = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email) {
      toast.error("User email not found");
      return;
    }

    
      const response = await axios.post(
        "/api/task/admin/create",
        {
          title,
          due_date: date,
          priority,
          status,
          assign,
          desc,
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

      if (data.status === 201) {
        toast.success(data.message);
        router.back();
      } else {
        toast.error(data.message);
      }
    
  };

  return (
    <>
      <div className="flex w-full">
        <div>
          {showSideBar && (
            <div>
              <SideBar />
            </div>
          )}
        </div>

        <div className="w-full">
          <Navbar />

          <div className="bg-[#F5F5F5] w-full min-h-screen flex justify-center items-center p-8">
            <form
              onSubmit={handleCreateTask}
              className="flex flex-col justify-between rounded-xl p-8 w-full max-w-6xl max-h-4xl h-[90vh] bg-white"
            >
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Title
                  </label>

                  <input
                    name="title"
                    type="text"
                    placeholder="Creating Awesome Mobile Apps"
                    required
                    value={title}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Due Date
                  </label>

                  <input
                    name="date"
                    type="date"
                    required
                    value={date}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={priority}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white"
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={status}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="assignee"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    Assignee
                  </label>

                  <select
                    name="assignee"
                    value={assign}
                    onChange={(e) => {
                      setAssign(e.target.value);                      
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select an assignee
                    </option>

                    {assignees?.map((assignee: user_data) => (
                      <option key={assignee.email} value={assignee.email}>
                        {assignee.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Description
                  </label>

                  <input
                    name="desc"
                    type="text"
                    placeholder="Lorem ipsum dolor sit amet"
                    required
                    value={desc}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!email}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white text-sm font-medium px-10 py-3 rounded-lg transition-all duration-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create_Task;

