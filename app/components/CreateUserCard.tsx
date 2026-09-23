"use client";

import context from "@/context/context";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CreateUserCard = () => {
  const { setShowCreateUserCard, router } = useContext(context);
  const roles = [
    "Manager",
    "Doctor",
    "Engineer",
    "Teacher",
    "Consultant",
    "Other",
  ];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0]);  
  const [other, setOther] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userEmail } = useContext(context);

  const handleCreateUser = async () => {
    // Use the custom-entered role when "Other" was selected
    const finalRole = role === "Other" ? other.trim() : role;

    if (role === "Other" && !finalRole) {
      toast.error("Please enter your role");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/users/create",
        {
          f_name: name!,
          email: email!,
          password: password!,
          role: finalRole!,
          admin_email: userEmail!,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.status === 201) {
        toast.success(data.message);
        setLoading(false);

        setShowCreateUserCard(false);

        // Optional: refresh the page/list of users
        router.refresh();
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error: any) {
      setLoading(false);

      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="bg-[#0000005C] fixed inset-0 z-50 w-full min-h-screen flex justify-center items-center p-3 sm:p-5">
      <div className="rounded-xl p-4 sm:p-6 md:p-8 w-full sm:w-[90vw] md:w-[80vw] lg:w-[65vw] h-auto max-h-[90vh] bg-white overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="font-semibold text-xl sm:text-2xl">Create User</div>

          <svg
            className="text-gray-500 hover:text-black text-xl font-semibold cursor-pointer"
            onClick={() => setShowCreateUserCard(false)}
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

          {/* Card title */}
          <div className="text-[#546FFF] font-bold text-xl sm:text-2xl">
            Create a new user
          </div>

          {/* User fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Full Name</div>

              <input
                name="name"
                type="text"
                placeholder="Enter full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block mb-2 text-gray-600">
                Choose a role:
              </label>
              {!showOtherInput ? (
                <div>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-700 transition-all duration-200"
                    onChange={(e) => {
                      const value = e.target.value;

                      setRole(value);
                      setShowOtherInput(value === "Other");

                      if (value !== "Other") {
                        setOther("");
                      }

                      
                    }}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex gap-2 items-center w-full">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={other}
                      placeholder="Ente role"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-200 placeholder-gray-600 transition-all duration-200"
                      onChange={(e) => {
                        const value = e.target.value;

                        const exists = roles.some(
                          (role) =>
                            role.toLocaleLowerCase() ===
                            value.trim().toLocaleLowerCase(),
                        );

                        if (exists) {
                          toast.error(
                            "Cannot set value that is already in specified roles",
                          );
                        } else {
                          setOther(value);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setShowOtherInput(false);
                      }}
                    >
                      <svg
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
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Email</div>

              <input
                name="email"
                type="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">Password</div>

              <input
                name="password"
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              disabled={loading}
              type="button"
              onClick={handleCreateUser}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#546FFF] text-white hover:bg-blue-600 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserCard;
