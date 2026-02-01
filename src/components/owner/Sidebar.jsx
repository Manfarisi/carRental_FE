import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState("");

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/update-image", formData);
      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <aside className="w-72 min-h-screen bg-linear-to-b from-slate-50 to-white border-r border-gray-200 px-6 py-8 flex flex-col">
      {/* PROFILE */}
      <div className="flex flex-col items-center text-center">
        <label htmlFor="image" className="relative group cursor-pointer">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12"
            }
            alt=""
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
          />

          {/* edit overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/70 to-indigo-600/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <img src={assets.edit_icon} alt="" className="w-5 invert" />
          </div>

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {image && (
          <button
            onClick={updateImage}
            className="mt-4 flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-sm font-medium px-5 py-2 rounded-full shadow-md transition"
          >
            Save
            <img src={assets.check_icon} width={14} alt="" />
          </button>
        )}

        <p className="mt-4 text-lg font-bold text-gray-900">{user?.name}</p>
        <p className="text-sm text-indigo-600 font-medium">Owner Dashboard</p>
      </div>

      {/* MENU */}
      <nav className="mt-10 flex flex-col gap-2">
        {ownerMenuLinks.map((link, index) => {
          const isActive = link.path === location.pathname;

          return (
            <NavLink
              key={index}
              to={link.path}
              className={`
                group flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium
                ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-indigo-50"
                }
              `}
            >
              {/* ICON */}
              <div
                className={`
                  p-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-white/20"
                      : "bg-gray-100 group-hover:bg-indigo-100"
                  }
                `}
              >
                <img
                  src={isActive ? link.coloredIcon : link.icon}
                  alt=""
                  className={`w-5 ${isActive ? "invert" : ""}`}
                />
              </div>

              {/* TEXT */}
              <span
                className={`flex-1 ${
                  isActive ? "text-white" : "group-hover:text-indigo-600"
                }`}
              >
                {link.name}
              </span>

              {/* ACTIVE DOT */}
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-6 text-center text-xs text-gray-400">
        © 2025 <span className="text-indigo-600 font-medium">CarRental</span>
      </div>
    </aside>
  );
};

export default Sidebar;
