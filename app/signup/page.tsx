"use client";

import { useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import context from "@/context/context";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");
  const [other, setOther] = useState("");

  const [showOtherInput, setShowOtherInput] = useState(false);

  // OTP states
  const [OTP, setOTP] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);

  const [OTPloading, setOTPLoading] = useState(false);
  const [signupLoading,setSignupLoading] = useState(false);
  const { router } = useContext(context);

  const roles = [
    "Manager",
    "Doctor",
    "Engineer",
    "Teacher",
    "Consultant",
    "Other",
  ];

  
  // SEND OTP
  
  const handleEmailSend = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setOTPLoading(true);

      const response = await axios.post(
        `/api/auth/sendEmail`,
        {
          f_name: name,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.status === 200) {
        setShowOTPInput(true);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setOTPLoading(false);
    }
  };

  
  // SIGNUP FORM
  
  const handleSignup = async () => {
    // Prevent signup if Other is selected but no custom role is entered
    if (role === "Other" && !other.trim()) {
      toast.error("Please enter your role");
      return;
    }
    if (!OTP.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setSignupLoading(true);

    try {
      const response = await axios.post(
        `/api/users/admin/signup`,
        {
          f_name: name,
          email: email,
          password: password,
          role: role === "Other" ? other.trim() : role,
          otp: OTP,
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

        setShowOTPInput(false);
        setOTP("");

        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-[url('/signup_login_bg.png')] bg-cover bg-center h-screen w-full">
      <div className="w-1/2 md:w-1/3 flex justify-center items-center bg-white py-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center items-center gap-2">
            <div>
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

            <div className="text-center">
              <h1 className="text-4xl font-semibold">Taska</h1>
            </div>
          </div>

          {/* Signup Form */}
          <div className="rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-left text-gray-500">
              Welcome to Taska!
            </h2>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleEmailSend();
              }}
            >
              {/* Name */}
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 placeholder-gray-600 transition-all duration-200"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block mb-2 text-gray-600">
                  Choose a role:
                </label>

                <select
                  id="role"
                  name="role"
                  value={role}
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-700 transition-all duration-200"
                  onChange={(e) => {
                    const selectedRole = e.target.value;

                    setRole(selectedRole);

                    setShowOtherInput(selectedRole === "Other");

                    if (selectedRole !== "Other") {
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

              {/* Custom Role */}
              {showOtherInput && (
                <div>
                  <input
                    type="text"
                    value={other}
                    placeholder="Enter your role"
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
              )}

              {/* Email */}
              <div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 placeholder-gray-600 transition-all duration-200"
                />
              </div>

              {/* Send OTP Button - only shown once an email has been entered */}
              {email.trim() && (
                <button                  
                  disabled={OTPloading}
                  type="submit"
                  className="w-full bg-indigo-500 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {OTPloading ? "Sending OTP..." : "SEND OTP"}
                </button>
              )}
            </form>

            {/* Login Link */}
            <p className="text-center mt-5 text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP POPUP */}

      {showOTPInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div
              onClick={() => {
                setShowOTPInput(false);
              }}
              className="cursor-pointer flex justify-end text-gray-500 hover:text-gray-700 transition-colors"
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
            </div>

            <h2 className="text-2xl font-bold text-gray-700 text-center">
              Verify Your Email
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2 mb-5">
              Enter the OTP sent to
              <br />
              <span className="font-semibold text-gray-700">{email}</span>
            </p>

            <input
              type="text"
              value={OTP}
              placeholder="Enter OTP"
              maxLength={6}
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-gray-200 placeholder-gray-600 text-center tracking-widest text-lg"
              onChange={(e) => {
                setOTP(e.target.value);
              }}
            />

            {/* Password */}
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-4 px-4 py-3 rounded-lg bg-gray-200 placeholder-gray-600 transition-all duration-200"
            />

            <button
              type="button"
              onClick={handleSignup}
              disabled={signupLoading}
              className="w-full mt-4 bg-indigo-500 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signupLoading ? "Signing up..." : "Signup"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
