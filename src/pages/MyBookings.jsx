import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, SetBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        SetBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const statusConfig = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          label: "✔ Confirmed",
          className: "bg-green-100 text-green-700 border border-green-300",
        };
      case "Cancelled":
        return {
          label: "✖ Cancelled",
          className: "bg-red-100 text-red-700 border border-red-300",
        };
      default: // Pending
        return {
          label: "⏳ Pending",
          className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        };
    }
  };

  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);

  const canCancelBooking = (booking) => {
  const pickupDate = new Date(booking.pickupDate);
  const today = new Date();

  return (
    booking.status !== "Cancelled" &&
    pickupDate > today
  );
};

const handleCancelBooking = async (id) => {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  try {
    const { data } = await axios.put(`/api/bookings/cancel/${id}`);
    if (data.success) {
      toast.success("Booking cancelled");
      fetchMyBookings();
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      <div className="mt-10 flex flex-col gap-6">
        {bookings.map((booking, index) => (
          <div
            key={booking._id}
            className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6"
          >
            {/* STATUS BADGE */}
            <span
              className={`absolute top-1 right-1 px-3 py-1 rounded-full text-xs font-semibold
    ${statusConfig(booking.status).className}`}
            >
              {statusConfig(booking.status).label}
            </span>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* LEFT – IMAGE & BASIC INFO */}
              <div className="flex gap-6 flex-1">
                <div className="w-full sm:w-60 h-40 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={booking.car?.images?.[0] || assets.placeholder_car}
                    alt=""
                    className="w-full h-full ob ject-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-xl font-semibold text-gray-900">
                    {booking.car?.brand || "Car not available"}{""} {booking.car?.model || ""}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {booking.car?.year || ""} • {booking.car?.category || ""} •{" "}
                    {booking.car?.location || "Location not available"}{""}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    Booking #{index + 1}
                  </p>
                </div>
              </div>

              {/* RIGHT – DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-[520px]">
                {/* RENTAL */}
                <div className="flex gap-3 items-start bg-gray-50 rounded-xl p-4">
                  <img
                    src={assets.calendar_icon_colored}
                    alt=""
                    className="w-6"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Rental Period
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.pickupDate.split("T")[0]} →{" "}
                      {booking.returnDate.split("T")[0]}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex gap-3 items-start bg-gray-50 rounded-xl p-4">
                  <img
                    src={assets.location_icon_colored}
                    alt=""
                    className="w-6"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Pick-up Location
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.car?.location||""}
                    </p>
                  </div>
                </div>

                {/* PRICE */}
                <div className="flex flex-col justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Price
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {currency}
                    {booking.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    Booked on {booking.createdAt.split("T")[0]}
                  </p>
                 
                
                {canCancelBooking(booking) && (
  <button
    onClick={() => handleCancelBooking(booking._id)}
    className="mt-3 px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
  >
    Cancel Booking
  </button>
)}
</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
