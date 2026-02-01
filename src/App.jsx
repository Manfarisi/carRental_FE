import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Footer from "./components/Footer";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageBooking from "./pages/owner/ManageBooking";
import ManageCar from "./pages/owner/ManageCar";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import EditCar from "./pages/owner/EditCar";
import ChatPage from "./pages/ChatPage";
import ChatRoom from "./pages/owner/ChatRoom";
import ChatHistory from "./pages/ChatHistory";
const App = () => {
  const { showLogin } = useAppContext();
  const isOwerPath = useLocation().pathname.startsWith("/owner");
  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwerPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path='/chat/:roomId' element={<ChatPage />} />
        <Route path='/roomChat' element={<ChatHistory />} />

        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCar />} />
          <Route path="/owner/edit-car/:id" element={<EditCar />} />
          <Route path="manage-bookings" element={<ManageBooking />} />
          <Route path="chat-rooms" element={<ChatRoom />} />
        </Route>
      </Routes>

      {!isOwerPath && <Footer />}
    </>
  );
};

export default App;
