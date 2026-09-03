"use client";

import context from "@/context/context";
import { task_info } from "@/interfaces";
import { useContext } from "react";
import { getStatusClass } from "./Tasks";
import { getPriorityFlag } from "./Tasks";
const TaskCard = ({
  title,
  due_date,
  assign,
  priority,
  status,
  desc,
}: task_info) => {
  const { setShowTask} = useContext(context); 
  const name = localStorage.getItem("name") 
  return (
    <div className="fixed inset-0 z-50 bg-[#0000005C] flex items-center justify-center p-4">
      <div className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[65vw] max-h-[90vh] bg-white rounded-xl p-5 sm:p-6 md:p-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl sm:text-2xl">Task Details</h2>


            <svg
              className="text-gray-500 hover:text-black text-xl font-semibold cursor-pointer"
              onClick={() => setShowTask(false)}
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

        <div className="border border-[#D7D7D7] mt-5" />

        <div className="mt-6">
          <div className="text-[#546FFF] font-bold text-xl sm:text-2xl ">
            {title}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-6 mt-8">
          <div className="min-w-0">
            <div className="text-[#656F7D] text-sm mb-2">Due Date</div>
            <div className="font-semibold ">{due_date}</div>
          </div>

          <div className="min-w-0">
            <div className="text-[#656F7D] text-sm mb-2">Assignee</div>
            <div className="font-semibold ">{assign}</div>
          </div>

          <div className="min-w-0">
            <div className="text-[#656F7D] text-sm mb-2">Priority</div>
            <div className="flex gap-2 items-center">
              <div>
                <img src={`${getPriorityFlag(priority)}`} alt="flag" />
              </div>
              <div className="font-semibold ">{priority}</div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[#656F7D] text-sm mb-2">Status</div>
            <span
              className={`${getStatusClass(status)} inline-block px-3 py-1 bg-[#FFB72B] text-white rounded-md text-sm `}
            >
              {status}
            </span>
          </div>

          <div className="min-w-0">
            <div className="text-[#656F7D] text-sm mb-2">Assigned by</div>
            <div className="font-semibold ">{name}</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-[#656F7D] text-sm mb-2">Description</div>

          <div className="min-h-[150px] max-h-[30vh] w-full border border-[#D7D7D7] rounded-xl p-4 overflow-y-auto text-sm sm:text-base text-gray-700">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
