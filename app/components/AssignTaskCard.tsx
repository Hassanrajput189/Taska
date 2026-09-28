"use client";

import context from "@/context/context";
import { task_info, user_data } from "@/interfaces";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const AssignTaskCard = ({ title, assign }: task_info) => {
  const { setShowAssignTaskCard, setTasks, assignees ,userEmail} = useContext(context);

  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedAssignee) {
      toast.error("Please select an assignee");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch("/api/task/admin/assign_task", {
        title,
        assign,
        newAssign: selectedAssignee,
        admin_email:userEmail
      });

      const data = response.data;

      if (data.status === 200) {
        setTasks((prev: task_info[]) =>
          prev.map((task) =>
            task.title === title && task.assign === assign
              ? { ...task, assign: selectedAssignee }
              : task,
          ),
        );

        toast.success(data.message);
        setShowAssignTaskCard(false);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0000005C] fixed inset-0 z-50 w-full min-h-screen flex justify-center items-center p-3 sm:p-5">
      <div className="rounded-xl p-4 sm:p-6 md:p-8 w-full sm:w-[90vw] md:w-[50vw] lg:w-[35vw] h-auto max-h-[90vh] bg-white overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-xl sm:text-2xl">Assign Task</div>

          <svg
            className="text-gray-500 hover:text-black text-xl font-semibold cursor-pointer"
            onClick={() => setShowAssignTaskCard(false)}
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

          <div className="text-[#546FFF] font-bold text-xl sm:text-2xl">
            {title}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[#656F7D]">Assignee</div>

            {assignees && assignees.length > 0 ? (
              <select
                name="assignee"
                value={selectedAssignee}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                onChange={(e) => setSelectedAssignee(e.target.value)}
              >
                <option value="" disabled>
                  Select an assignee
                </option>

                {assignees.map((assignee: user_data, index: number) => (
                  <option key={index} value={assignee.email}>
                    {assignee.email}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">
                No users available to assign
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              disabled={loading || !assignees || assignees.length === 0}
              type="button"
              onClick={handleAssign}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#546FFF] text-white hover:bg-blue-600 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskCard;