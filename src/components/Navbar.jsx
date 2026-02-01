import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();
  const location = useLocation();
  const [open, SetOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4
      text-gray-600 border-b border-borderColor relative transition-all 
      ${location.pathname === "/" && "bg-light"}`}
    >
      {/* LOGO */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>

      {/* MENU NAV */}
      <div
        className={`
          max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 right-0 
          flex flex-col sm:flex-row items-start sm:items-center
          gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
          ${location.pathname === "/" ? "bg-light" : "bg-white"}
          ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}
        `}
      >
        {/* MENU LINKS */}
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
          <input
            type="text"
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            placeholder="Search Products"
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 opacity-70 hover:opacity-100 transition"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg shadow hover:bg-sky-700 transition cursor-pointer"
          >
            {isOwner ? "Dashboard" : "List Cars"}
          </button>

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-blue-700 hover:text-white transition cursor-pointer"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* MENU ICON — hanya muncul di layar kecil */}
      <button
        aria-label="Menu"
        onClick={() => SetOpen(!open)}
        className="sm:hidden p-3 rounded-xl bg-white/70 backdrop-blur shadow hover:bg-white/90 transition cursor-pointer"
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="menu"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
};

export default Navbar;
