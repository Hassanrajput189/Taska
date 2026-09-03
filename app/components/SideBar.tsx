
"use client";

import context from "@/context/context";
import { useContext } from "react";

const SideBar = () => {
  const { router, isAdmin } = useContext(context);

  return (
    <div className="px-10 py-8">

      <div className="flex items-center gap-2 text-3xl mb-8">
        <div className="w-10 h-10 shrink-0">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.9833 3.3335H13.0166C6.94998 3.3335 3.33331 6.95016 3.33331 13.0168V26.9668C3.33331 33.0502 6.94998 36.6668 13.0166 36.6668H26.9666C33.0333 36.6668 36.65 33.0502 36.65 26.9835V13.0168C36.6666 6.95016 33.05 3.3335 26.9833 3.3335ZM19.1666 28.7502C19.1666 29.3502 18.5666 29.7502 18.0166 29.5168C16 28.6502 13.3666 27.8502 11.5333 27.6168L11.2166 27.5835C10.2 27.4502 9.36665 26.5002 9.36665 25.4668V12.6335C9.36665 11.3502 10.4 10.4002 11.6666 10.5002C13.75 10.6668 16.8333 11.6668 18.7666 12.7668C19.0333 12.9168 19.1666 13.2002 19.1666 13.4835V28.7502ZM30.6333 25.4502C30.6333 26.4835 29.8 27.4335 28.7833 27.5668L28.4333 27.6002C26.6166 27.8502 24 28.6335 21.9833 29.4835C21.4333 29.7168 20.8333 29.3168 20.8333 28.7168V13.4668C20.8333 13.1668 20.9833 12.8835 21.25 12.7335C23.1833 11.6502 26.2 10.6835 28.25 10.5002H28.3166C29.6 10.5002 30.6333 11.5335 30.6333 12.8168V25.4502Z"
              fill="#546FFF"
            />
          </svg>
        </div>

        <div className="font-semibold">
          Taska
        </div>
      </div>


      <div className="flex flex-col justify-center items-center space-y-2">


        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex items-center gap-2 pl-2 pr-6 py-2 bg-[#F5F5F7] rounded-md w-full cursor-pointer"
        >
          <div className="w-6 h-6 shrink-0 flex items-center justify-center">
            <img
              src="/moduleSVG.svg"
              alt="Task"
              width={24}
              height={24}
              className="w-6 h-6 block"
            />
          </div>

          <div className="whitespace-nowrap">
            Task
          </div>
        </div>


        {isAdmin && (
          <div
            onClick={() => {
              router.push("/signup");
            }}
            className="flex items-center gap-2 pl-2 pr-6 py-2 bg-[#F5F5F7] rounded-md w-full cursor-pointer"
          >
            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
              <img
                src="/moduleSVG.svg"
                alt="Create Users"
                width={24}
                height={24}
                className="w-6 h-6 block"
              />
            </div>

            <div className="whitespace-nowrap">
              Create Users
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;

