import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import CarCard from "./CarCard";

const Hero = () => {
  const [search, setSearch] = useState("");

  const {
    cars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
  } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/cars?search=${search}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  const filteredCars = cars.filter((car) =>
    Object.values({
      brand: car.brand,
      model: car.model,
      category: car.category,
      location: car.location,
    })
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="w-full bg-gradient-to-b from-[#eef3ff] to-[#f9fbff] pt-24 pb-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-14">
          Luxury Cars on Rent
        </h1>

        {/* Search Card */}
        <form
          onSubmit={handleSearch}
          className="bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl 
                     rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center 
                     justify-center max-w-5xl mx-auto"
        >
          {/* Search Input */}
          <div className="w-full md:w-64">
            <label className="text-sm font-semibold text-gray-700">
              Search Car
            </label>
            <input
              type="text"
              placeholder="Brio, SUV, Jakarta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Pickup Date */}
          <div className="w-full md:w-auto">
            <label className="text-sm font-semibold text-gray-700">
              Pick-up Date
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none cursor-pointer"
              required
            />
          </div>

          {/* Return Date */}
          <div className="w-full md:w-auto">
            <label className="text-sm font-semibold text-gray-700">
              Return Date
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              className="mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none cursor-pointer"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-white hover:bg-gray-200 text-blue-500
                       rounded-xl px-8 py-4 font-semibold flex items-center gap-2
                       shadow-md active:scale-95 transition cursor-pointer"
          >
            <img src={assets.search_icon} className="w-5 invert text-white" />
            Search
          </button>
        </form>

        {/* Search Result */}
        {search && (
          <div className="mt-16">
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                🚗 Tidak ada mobil yang cocok
              </p>
            )}
          </div>
        )}

        {/* Hero Image */}
        {!search && (
          <img
            src={assets.sewa_mobil}
            alt="car"
            className="max-w-4xl w-full mx-auto mt-20 drop-shadow-2xl"
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
