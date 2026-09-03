"use client";

import context from "@/context/context";
import { user_data, task_info } from "@/interfaces";
import axios from "axios";
import { toNamespacedPath } from "path";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const EditCard = ({
  title,
  due_date,
  assign,
  priority,
  status,
  desc,
}: task_info) => {
  const { setShowEditCard, setTasks, assignees, isAdmin } = useContext(context);

  const [newDate, setNewDate] = useState(due_date);
  const [newAssign, setNewAssign] = useState(assign);
  const [newPriority, setNewPriority] = useState(priority);
  const [newStatus, setNewStatus] = useState(status);
  const [newDesc, setNewDesc] = useState(desc);  
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");

  const handleUpdate = async () => {
    const updatedTask = {
      title: title,
      email: email,
      due_date: newDate,
      priority: newPriority,
      status: newStatus,
      assign: newAssign,
      desc: newDesc,
    };

    const response = await axios.patch("/api/task/update", updatedTask);

    const data = response.data;    
        
    if (data.status === 200) { 
      
      console.log(updatedTask.assign)
      console.log(assign)
      console.log(newAssign)
      setTasks((prev: task_info[]) =>        
        prev.map((task) =>          
          task.title === title && task.assign === newAssign      
            ? {
                ...task,
                due_date: newDate,
                priority: newPriority,
                status: newStatus,                
                desc: newDesc,
              }
            : task,
        ),
      );
      
      toast.success(data.message);
      setShowEditCard(false);
    } else if (data.success === 201) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="bg-[#0000005C] fixed inset-0 z-50 w-full min-h-screen flex justify-center items-center p-3 sm:p-5">
      <div className="rounded-xl p-4 sm:p-6 md:p-8 w-full sm:w-[90vw] md:w-[80vw] lg:w-[65vw] h-auto max-h-[90vh] bg-white overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-xl sm:text-2xl">Edit Card</div>

          <svg
            className="text-gray-500 hover:text-black text-xl font-semibold cursor-pointer"
            onClick={() => setShowEditCard(false)}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1.40835L12.59 0L7 5.58348L1.41 0L0 1.40835L5.59 6.99183L0 12.5753L1.41 13.9837L7 8.40019L12.59 13.9837L14 12.5753L8.41 6.99183L14 1.40835Z"
              fill="#4C4E64"
              fillOpacity="0.54"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-5 sm:gap-8 mt-5">
          <div className="border border-[#D7D7D7]" />

          <div className="text-[#546FFF] font-bold cursor-pointer text-xl sm:text-2xl">
            {title}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Due Date</div>

              <input
                name="date"
                type="date"
                required
                value={newDate}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Assignee</div>

              {isAdmin && assignees && assignees.length > 0 ? (
                <select
                  name="assignees"
                  value={newAssign}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  onChange={(e) => setNewAssign(e.target.value)}
                >
                  {assignees.map((assignee: user_data, index: number) => (
                    <option key={index} value={assignee.email}>
                      {assignee.email}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="font-semibold text-gray-700 py-3">
                  {newAssign}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Priority</div>

              <select
                name="priority"
                value={newPriority}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Status</div>

              <select
                name="status"
                value={newStatus}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Assigned by</div>

              <div className="font-semibold text-gray-700 py-3">{name}</div>
            </div>
          </div>

          <div>
            <textarea
              name="desc"
              placeholder="Lorem ipsum dolor sit amet"
              required
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full min-h-[150px] sm:h-[20vh] border border-[#D7D7D7] rounded-xl p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleUpdate}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#546FFF] text-white hover:bg-blue-600 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
