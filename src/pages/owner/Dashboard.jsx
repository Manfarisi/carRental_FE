import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    {
      title: "Total Cars",
      value: data.totalCars,
      icon: assets.carIconColored,
      bg: "from-blue-400 to-blue-500",
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
      bg: "from-slate-400 to-slate-500",
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
      bg: "from-amber-400 to-amber-500",
    },
    {
      title: "Confirmed",
      value: data.completedBookings,
      icon: assets.tick_icon,
      bg: "from-emerald-400 to-emerald-500",
    },
  ];

  const fetchDasboardData = async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDasboardData();
    }
  }, [isOwner]);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen px-6 pt-8">
      <Title
        title="Admin Dashboard"
        subTitle="Overview of cars, bookings, and revenue performance"
      />

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl p-5 text-white shadow-lg bg-linear-to-br ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{card.title}</p>
                <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <img src={card.icon} className="w-6" alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* ===== RECENT BOOKINGS ===== */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Bookings
            </h3>
            <p className="text-sm text-gray-500">Latest customer activity</p>
          </div>

          <div className="space-y-4">
            {data.recentBookings.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <img src={assets.listIconColored} className="w-5" alt="" />
                  </div>

                  <div>
                    {/* <p className="font-semibold text-gray-900">
                      {booking.car.brand} {booking.car.model}
                    </p> */}
                    <p className="text-xs text-gray-500">
                      {booking.createdAt.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {currency}
                    {booking.price}
                  </p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MONTHLY REVENUE ===== */}
        <div className="rounded-2xl p-6 text-white shadow-xl bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600">
          <div>
            <h3 className="text-xl font-semibold">Monthly Revenue</h3>
            <p className="text-sm opacity-90 mt-1">Revenue this month</p>
          </div>

          <div className="mt-10">
            <p className="text-5xl font-extrabold">
              {currency}
              {data.monthlyRevenue}
            </p>
            <div className="h-2px bg-white/30 my-5 rounded-full" />
            <p className="text-sm opacity-90">Auto-calculated from bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
