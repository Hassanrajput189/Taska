import { useContext } from "react";
import context from "@/context/context";
import axios from "axios";
import { user_data, task_info, UserPermissionProps } from "@/interfaces";
import toast from "react-hot-toast";
import { handleAssigneeFetch } from "@/utils";

const UserPermissionCard = ({
  email,
  admin_email,
  title,
  assign,
}: UserPermissionProps) => {
  const {
    setShowUserPermissionCard,
    setUsers,
    userEmail,
    setAssignees,
    permission,
    setTasks,
    module,    
    setLoading,
  } = useContext(context);

  const handleTaskDelete = async () => {
    try{
      setLoading(true)
    const response = await axios.delete("/api/task/admin/delete", {
      data: {
        title,
        assign: assign ?? "",
        admin_email: userEmail,
      },
    });

    const data = response.data;

    if (data.status === 200) {
      setTasks((prev: task_info[]) =>
        prev.filter(
          (task) =>
            !(task.title === title && (task.assign ?? "") === (assign ?? "")),
        ),
      );
      
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }    
    }
    catch (error) {
      toast.error("Failed to delete task")
}
    finally{
      setLoading(false)
    }
  };
  const handleUserTasksDelete = async () => {
    try {
      setLoading(true)
      const response = await axios.delete("/api/task/admin/deleteAll", {
        data: {
          assign: email,
          admin_email,
        },
      });

      const data = response.data;

      if (data.status === 200) {
        setTasks((prev: task_info[]) =>
          prev ? prev.filter((task) => task.assign !== email) : prev,
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user's tasks");
    }
    finally{
      setLoading(false)
    }
  }; // Delete user
  const handleUserDelete = async () => {
    try {
      setLoading(true)
      const response = await axios.delete("/api/users/admin/delete", {
        data: {
          email,
          admin_email,
        },
      });

      const data = response.data;

      if (data.status === 200) {
        setUsers((prev: user_data[]) =>
          prev.filter((user) => user.email !== email),
        );
        await handleUserTasksDelete();
        await handleAssigneeFetch(admin_email!, setAssignees,setLoading);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
    finally{
      setLoading(false)
    }
  };

  // Disable user
  const handleUserDisable = async () => {
    try {
      setLoading(true)
      const response = await axios.patch("/api/users/admin/disable", {
        email,
        admin_email,
      });

      const data = response.data;

      if (data.status === 200) {
        toast.success(data.message);
        // Update ONLY the selected user
        setUsers((prev: user_data[]) =>
          prev.map((user) =>
            user.email === email
              ? {
                  ...user,
                  is_active: !user.is_active,
                }
              : user,
          ),
        );
        handleAssigneeFetch(userEmail, setAssignees,setLoading);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to disable user");
    }
    finally{
      setLoading(false)
    }
  };
  const switchPermissionMethods = async (permission?: string) => {
    const lowerPermission = permission?.toLocaleLowerCase();
    if (lowerPermission && lowerPermission !== "") {
      if (
        (lowerPermission === "disable" || lowerPermission === "enable") &&
        module === "user"
      ) {
        await handleUserDisable();
      } else if (lowerPermission === "delete" && module === "user") {
        await handleUserDelete();
      } else if (lowerPermission === "delete" && module === "task") {
        await handleTaskDelete();
      } else {
        toast.error("Permission is not set");
      }
    }
  };
  const message = `Are you sure you want to ${permission.toUpperCase()} this ${module.charAt(0).toUpperCase() + module.slice(1)}?`;
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-red-500 text-center">
            {message}
          </h2>

          <div className="flex gap-2 justify-center font-semibold text-white mt-4">
            <button
              type="button"
              onClick={() => {
                switchPermissionMethods(permission);
                setShowUserPermissionCard(false);
              }}
              className="w-full  bg-indigo-500 py-2 rounded-2xl  hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUserPermissionCard(false);
              }}
              className="w-full  bg-indigo-500  py-2 rounded-2xl hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionCard;
