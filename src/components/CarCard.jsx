import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        scrollTo(0, 0);
      }}
      className="
        bg-white rounded-2xl shadow-md border border-gray-100 
        p-5 cursor-pointer 
        hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 
        transition-all duration-300
      "
    >
      {/* Image + Price */}
      <div className="relative">
        <img
          src={car.images?.[0]}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover rounded-xl"
        />

        {!car.isDateAvailable && car.bookedFrom && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
            Booked {new Date(car.bookedFrom).toLocaleDateString()} –{" "}
            {new Date(car.bookedUntil).toLocaleDateString()}
          </span>
        )}

        <div
          className="
            absolute bottom-3 right-3 
            bg-white/90 backdrop-blur 
            px-4 py-1 rounded-lg shadow-md 
            flex items-center gap-1 border border-gray-200
          "
        >
          <p>{car.name}</p>
          <span className="text-lg font-bold text-blue-600">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-gray-500 text-sm">/day</span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {car.brand} • {car.model}
        </h3>
        <p className="text-sm text-gray-500">
          {car.transmission} • {car.year}
        </p>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-4 mt-5 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <img src={assets.users_icon} className="w-5 opacity-70" />
          <span>{car.seat_capacity} Seats</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={assets.fuel_icon} className="w-5 opacity-70" />
          <span>{car.fuel_type}</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={assets.car_icon} className="w-5 opacity-70" />
          <span>{car.transmission}</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={assets.location_icon} className="w-5 opacity-70" />
          <span>{car.location}</span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
