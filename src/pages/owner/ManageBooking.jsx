import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const ManageBooking = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);

  /* ================= FETCH DATA ================= */
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner");
      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  /* ================= STYLE HELPERS ================= */
  const statusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const paymentBadge = (method, status) => {
    if (status === "Cancelled") return "bg-gray-100 text-gray-600";
    return method === "Cash"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Title title="Manage Bookings" />

      <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          {/* HEADER */}
          <thead className="bg-gray-100 border-b">
            <tr className="text-sm font-semibold text-gray-700">
              <th className="px-8 py-5">Car</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Total</th>
              <th className="px-8 py-5">Payment</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5 text-center">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                {/* CAR */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.car?.images?.[0] || assets.placeholder_car}
                      alt={booking.car?.model}
                      className="w-24 h-16 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.car?.year}
                      </p>
                    </div>
                  </div>
                </td>

                {/* DATE */}
                <td className="px-8 py-6 text-sm">
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700">
                    {booking.pickupDate.split("T")[0]} →{" "}
                    {booking.returnDate.split("T")[0]}
                  </span>
                </td>

                {/* TOTAL */}
                <td className="px-8 py-6 font-semibold">
                  {currency}
                  {booking.price}
                </td>

                {/* PAYMENT */}
                <td className="px-8 py-6 space-y-2">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${paymentBadge(
                      booking.paymentMethod,
                      booking.status,
                    )}`}
                  >
                    {booking.paymentMethod}
                  </span>

                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </td>

                {/* CUSTOMER */}
                <td className="px-8 py-6 text-sm text-gray-700 space-y-1">
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600">
                        Username:
                      </span>
                      <span className="font-medium text-gray-900">
                        {booking.username}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600">
                        Email:
                      </span>
                      <span className="text-gray-800">{booking.email}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600">
                        Phone:
                      </span>
                      <span className="text-gray-800">
                        {booking.phoneNumber}
                      </span>
                    </div>
                  </div>
                </td>

                {/* ACTION */}
                <td className="px-8 py-6 text-center">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      changeBookingStatus(booking._id, e.target.value)
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer outline-none transition
                      ${statusBadge(booking.status)}
                    `}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
