"use client";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import context from "@/context/context";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [loading,setLoading] = useState(false)
  const { router,setIsAdmin } = useContext(context);

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const response = await axios.post(
      `/api/users/login`,
      {
        email: email,
        password: password,
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
      localStorage.setItem("name", data.data.f_name);
      localStorage.setItem("email", data.data.email);

      toast.success(data["message"]);
      setLoading(false)
      router.push("/");
    } else {
      toast.error(data["message"]);
      setLoading(false)
    }
  };

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await axios.get("/api/auth/verify", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (
          response.data.status === 200 &&
          response.data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
        ) {
          setIsAdmin(true);
        }
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-[url('/signup_login_bg.png')] bg-cover bg-center  h-screen w-full ">
      <div className="w-1/2 md:w-1/3  flex justify-center items-center  bg-white py-4 ">
        <div className="w-full max-w-md">
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
            <div className="text-center ">
              <h1 className="text-4xl font-semibold">Taska</h1>
            </div>
          </div>

          <div className="rounded-2xl  p-8  ">
            <h2 className="text-2xl font-bold mb-6 text-left text-gray-500">
              Welcome to Taska!
            </h2>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200  placeholder-gray-600  transition-all duration-200 "
                />
              </div>

              <div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg  bg-gray-200  placeholder-gray-600  transition-all duration-200"
                />
              </div>

              <button
                disabled = {loading}
                type="submit"
                className="w-full bg-indigo-500 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all duration-200"
              >
                {loading?"Signing you in...":"SIGN IN"}
              </button>
            </form>            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
