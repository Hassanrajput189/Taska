"use client";

import context from "@/context/context";
import { user_data } from "@/interfaces";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const UserEditCard = ({ f_name, email, role }: user_data) => {
  const {
    setShowUserEditCard,
    setUsers,
    isAdmin,
    userEmail,
    roles,
  } = useContext(context);

  // Check if the current user's role exists in the predefined roles
  const isPredefinedRole = roles.some(
    (item: string) =>
      item.toLowerCase() === role?.trim().toLowerCase(),
  );

  const [newName, setNewName] = useState(f_name);

  // If the existing role is predefined, show it in the dropdown.
  // Otherwise, show "Other".
  const [newRole, setNewRole] = useState(
    isPredefinedRole ? role : "Other",
  );

  // Store custom role here
  const [other, setOther] = useState(
    isPredefinedRole ? "" : role || "",
  );

  const [showOtherInput, setShowOtherInput] = useState(
    !isPredefinedRole,
  );

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!isAdmin) {
      toast.error("Only an admin can edit users");
      return;
    }

    // Determine the actual role to send
    const finalRole = showOtherInput
      ? other.trim()
      : newRole?.trim();

    if (!finalRole) {
      toast.error("Please select or enter a role");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch("/api/users/update", {
        email,
        f_name: newName,
        role: finalRole,
        admin_email: userEmail,
      });

      const data = response.data;

      if (data.status === 200) {
        setUsers((prev: user_data[]) =>
          prev.map((user) =>
            user.email === email
              ? {
                  ...user,
                  f_name: newName,
                  role: finalRole,
                }
              : user,
          ),
        );

        toast.success(data.message);
        setShowUserEditCard(false);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update user",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0000005C] fixed inset-0 z-50 w-full min-h-screen flex justify-center items-center p-3 sm:p-5">
      <div className="rounded-xl p-4 sm:p-6 md:p-8 w-full sm:w-[90vw] md:w-[80vw] lg:w-[65vw] h-auto max-h-[90vh] bg-white overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="font-semibold text-xl sm:text-2xl">
            Edit User
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setShowUserEditCard(false)}
            className="cursor-pointer"
          >
            <svg
              className="text-gray-500 hover:text-black"
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

        <div className="flex flex-col gap-5 sm:gap-8 mt-5">

          <div className="border border-[#D7D7D7]" />

          {/* User name */}
          <div className="text-[#546FFF] font-bold text-xl sm:text-2xl">
            {f_name}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">
                Email
              </div>

              <div className="font-semibold text-gray-700 py-3">
                {email}
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">
                Name
              </div>

              <input
                name="f_name"
                type="text"
                required
                value={newName}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
              <div className="text-[#656F7D]">
                Role
              </div>

              {!showOtherInput ? (
                /* Predefined Roles */
                <select
                  id="role"
                  name="role"
                  value={newRole}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  onChange={(e) => {
                    const value = e.target.value;

                    setNewRole(value);

                    if (value === "Other") {
                      setShowOtherInput(true);
                      setOther("");
                    }
                  }}
                >
                  {roles.map((role: string) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                /* Custom Role */
                <div className="flex gap-2 items-center w-full">

                  <div className="flex-1">
                    <input
                      type="text"
                      value={other}
                      placeholder="Enter role"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      onChange={(e) => {
                        const value = e.target.value;

                        const exists = roles.some(
                          (role: string) =>
                            role.toLowerCase() !== "other" &&
                            role.toLowerCase() ===
                              value.trim().toLowerCase(),
                        );

                        if (exists) {
                          toast.error(
                            "Cannot set a role that already exists in the specified roles",
                          );
                        } else {
                          setOther(value);
                        }
                      }}
                    />
                  </div>

                  {/* Back to dropdown */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtherInput(false);
                      setOther("");
                      setNewRole(roles[0] || "");
                    }}
                    className="flex items-center justify-center p-2 cursor-pointer"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 1.40835L12.59 0L7 5.58348L1.41 0L0 1.40835L5.59 6.99183L0 12.5753L1.41 13.9837L7 8.40019L12.59 13.9837L14 12.5753L14 12.5753Z"
                        fill="#4C4E64"
                        fillOpacity="0.54"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3">
            <button
              disabled={loading}
              type="button"
              onClick={handleUpdate}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#546FFF] text-white hover:bg-blue-600 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserEditCard;