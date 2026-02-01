import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    cars,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    user,
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [booking, setBooking] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  const currency = import.meta.env.VITE_CURRENCY || "Rp";

  /* =========================
      FETCH DATA
  ========================== */

  useEffect(() => {
    const found = cars.find((c) => c._id === id);
    if (found) setCar(found);
  }, [cars, id]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data } = await axios.get(
          `/api/bookings/booked-dates/${id}`
        );
        if (data.success) setBookedRanges(data.bookings);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchBookedDates();
  }, [id, axios]);

  /* =========================
      HELPERS
  ========================== */

  const isDateBooked = (date) => {
    return bookedRanges.some((range) => {
      const start = new Date(range.pickupDate);
      const end = new Date(range.returnDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const check = new Date(date);
      check.setHours(0, 0, 0, 0);

      return check >= start && check <= end;
    });
  };

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = end - start;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * (car?.pricePerDay || 0);

  /* =========================
      SUBMIT BOOKING
  ========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Please select rental dates");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        car: id,
        pickupDate,
        returnDate,
        paymentMethod,
        ...booking,
      };

      const { data } = await axios.post(
        "/api/bookings/create",
        payload
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
      CHAT OWNER
  ========================== */

  const handleChatOwner = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return navigate("/login");
    }

    if (user._id === car.owner) {
      return toast.error("Ini mobil milik Anda sendiri");
    }

    const roomId = `${car._id}_${user._id}`;
    const roomRef = doc(db, "chatRooms", roomId);

    try {
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        await setDoc(roomRef, {
          roomId,
          carId: car._id,
          carName: `${car.brand} ${car.model}`,
          carImage: car.images?.[0]?.url || car.images?.[0],
          ownerId: car.owner,
          customerId: user._id,
          customerName: user.name || "Customer",
          lastMessage: "Halo, saya tertarik dengan mobil ini",
          updatedAt: serverTimestamp(),
        });
      }

      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memulai chat");
    }
  };

  if (!car) return <Loader />;

  const images =
    car.images?.length > 0
      ? car.images.map((img) => img.url || img)
      : ["/placeholder-car.jpg"];

  /* =========================
      RENDER
  ========================== */

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-600 hover:text-blue-600"
      >
        <img src={assets.arrow_icon} className="w-4" />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
{/* LEFT COLUMN */}
<div className="lg:col-span-2 space-y-8">
  {/* Swiper Gallery */}
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000 }}
    className="rounded-xl overflow-hidden"
  >
    {images.map((img, index) => (
      <SwiperSlide key={index}>
        <img
          src={img}
          className="w-full h-[420px] object-cover"
          alt=""
        />
      </SwiperSlide>
    ))}
  </Swiper>

  {/* Car Title & Badges */}
  <div className="space-y-4">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-4xl font-extrabold text-gray-900">
        {car.brand} {car.model}
      </h1>

      <span
        className={`px-4 py-1.5 rounded-full text-sm font-bold ${
          car.isAvailable
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {car.isAvailable ? "● Available Now" : "● Currently Rented"}
      </span>
    </div>

    <p className="text-lg text-gray-500 font-medium">
      Edition {car.year}
    </p>
  </div>

  {/* Specs Grid */}
  <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
    <SpecCard
      icon={assets.users_icon}
      label={`${car.seat_capacity} Seats`}
    />
    <SpecCard icon={assets.fuel_icon} label={car.fuel_type} />
    <SpecCard icon={assets.carIcon} label={car.category} />
    <SpecCard icon={assets.gear} label={car.transmission} />
    <SpecCard icon={assets.location_icon} label={car.location} />
  </div>

  {/* Features */}
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800">
      Key Features
    </h3>

    <div className="flex flex-wrap gap-3">
      {Object.entries(car.features || {})
        .filter(([_, value]) => value)
        .map(([key]) => (
          <span
            key={key}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100 capitalize"
          >
            ✓ {key.replace(/_/g, " ")}
          </span>
        ))}
    </div>
  </div>

  {/* Description */}
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800">
      Description
    </h3>
    <p className="text-gray-600 leading-relaxed text-lg">
      {car.description}
    </p>
  </div>
</div>


        {/* RIGHT */}
<div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] sticky top-8 transition-all">
  {/* Header: Price Tag */}
  <div className="mb-8 bg-gradient-to-br from-blue-50 to-transparent p-5 rounded-2xl border border-blue-50">
    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Daily Rental Rate</p>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-gray-900">
        {currency}{car.pricePerDay.toLocaleString()}
      </span>
      <span className="text-gray-400 font-medium">/day</span>
    </div>
  </div>

  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Input Group */}
    <div className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Enter your name"
        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
        value={booking.username}
        onChange={(e) => setBooking({ ...booking, username: e.target.value })}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
        value={booking.email}
        onChange={(e) => setBooking({ ...booking, email: e.target.value })}
      />

      <Input
        label="Phone Number"
        placeholder="0812..."
        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
        value={booking.phoneNumber}
        onChange={(e) => setBooking({ ...booking, phoneNumber: e.target.value })}
      />
    </div>

    {/* Date Selection */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <DateField
          label="📅 Pickup"
          selected={pickupDate}
          onChange={setPickupDate}
          filter={isDateBooked}
        />
      </div>
      <div className="space-y-1">
        <DateField
          label="🏁 Return"
          selected={returnDate}
          onChange={setReturnDate}
          filter={isDateBooked}
          minDate={pickupDate}
        />
      </div>
    </div>

    {/* Price Summary Panel */}
    {totalDays > 0 && (
      <div className="bg-blue-600/5 border border-blue-100 p-5 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex justify-between text-sm text-gray-600 font-medium">
          <span>Duration</span>
          <span className="text-blue-600">{totalDays} days</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-blue-100">
          <span className="font-bold text-gray-800">Total Price</span>
          <span className="text-xl font-extrabold text-blue-600">
            {currency}{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    )}

    {/* Submit Button */}
    <button
      disabled={isSubmitting || !car.isAvailable}
      className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-[0.98] shadow-lg cursor-pointer ${
        car.isAvailable 
        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 shadow-blue-100" 
        : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </span>
      ) : car.isAvailable ? (
        "Confirm Booking"
      ) : (
        "Unit Not Available"
      )}
    </button>
  </form>

  {/* Chat Button */}
  <button
    onClick={handleChatOwner}
    className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-[0.98]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 4.417 4.417 0 00-.115-1.162C3.518 16.353 3 14.239 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
    Chat with Owner
  </button>
</div>
      </div>
    </div>
  );
}

/* =========================
    COMPONENTS
========================== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-bold text-gray-600">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full mt-1 border rounded-xl px-3 py-2"
    />
  </div>
);

const DateField = ({ label, selected, onChange, filter, minDate }) => (
  <div>
    <label className="text-xs font-bold text-gray-600">
      {label}
    </label>
    <DatePicker
      selected={selected ? new Date(selected) : null}
      onChange={(d) =>
        onChange(d ? d.toISOString().split("T")[0] : null)
      }
      minDate={minDate ? new Date(minDate) : new Date()}
      filterDate={(d) => !filter(d)}
      dateFormat="yyyy-MM-dd"
      className="w-full mt-1 border rounded-xl px-3 py-2"
    />
  </div>
);

export default CarDetails;
const SpecCard = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <img src={icon} className="w-6 h-6 opacity-60" alt="" />
    <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-tight">
      {label}
    </span>
  </div>
);
