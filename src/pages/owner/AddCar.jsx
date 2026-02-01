import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [images, setImages] = useState([]);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    licensePlate: "",
    transmission: "",
    fuel_type: "",
    seat_capacity: 0,
    location: "",
    description: "",
    features: {
      ac: false,
      audio: false,
      bluetooth: false,
      usbPort: false,
      rearCamera: false,
      parkingSensor: false,
      abs: false,
      gps: false,
    },
    category: {
    Hatchback:false,
    Sedan:false,
    SUV:false,
    MPV:false,
    Crossover:false,
    Pickup:false,
    Luxury:false,
    Electric:false,  
}
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (images.length === 0) {
        toast.error("Please upload car images");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();

      images.forEach((img) => {
        formData.append("images", img);
      });

      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImages([]);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          licensePlate: "",
          transmission: "",
          fuel_type: "",
          seat_capacity: 0,
          location: "",
          description: "",
          features: {
            ac: false,
            audio: false,
            bluetooth: false,
            usbPort: false,
            rearCamera: false,
            parkingSensor: false,
            abs: false,
            gps: false,
          },
          category: {
    Hatchback:false,
    Sedan:false,
    SUV:false,
    MPV:false,
    Crossover:false,
    Pickup:false,
    Luxury:false,
    Electric:false,  
}
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setCar((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: checked,
      },
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title
        title="Add New Car"
        subTitle="Fill in car details to list a new vehicle for booking"
      />

      <form
        onSubmit={onSubmitHandler}
        className="mt-6 bg-white rounded-2xl shadow-lg p-6 space-y-8"
      >
        {/* Upload Image */}
        <div>
          <p className="font-semibold text-gray-800 mb-2">Car Images (Max 5)</p>

          <label
            htmlFor="car-image"
            className="border-2 border-dashed border-blue-400 rounded-xl p-6 flex flex-wrap gap-4 cursor-pointer hover:bg-blue-50 transition"
          >
            {images.length === 0 ? (
              <img src={assets.upload_icon} className="w-12 mx-auto" />
            ) : (
              images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="w-28 h-20 object-cover rounded-lg"
                />
              ))
            )}
          </label>

          <input
            type="file"
            id="car-image"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setImages([...e.target.files].slice(0, 5))}
          />

          <p className="text-sm text-gray-500 mt-2">
            Upload up to 5 car photos
          </p>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Brand"
            placeholder="e.g. Toyota"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
          />
          <Input
            label="Model"
            placeholder="e.g. Corolla"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          />
        </div>

        {/* Year, Price, */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Year"
            type="number"
            placeholder="2024"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
          />

          <Input
            label="License Plate"
            type="text"
            placeholder="B 2026 UWA"
            value={car.licensePlate}
            onChange={(e) => setCar({ ...car, licensePlate: e.target.value })}
          />

          <Input
            label={`Daily Price (${currency})`}
            type="number"
            placeholder="500"
            value={car.pricePerDay}
            onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
          />
        </div>


        {/*Category, Transmission, Fuel, Seating */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Category"
            value={car.category}
            onChange={(e) => setCar({ ...car, category: e.target.value })}
            options={["Hatchback", "Sedan","SUV","MPV","Crossover","Pickup","Luxury","Electric"]}
          />

          <Select
            label="Transmission"
            value={car.transmission}
            onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            options={["Automatic", "Manual"]}
          />

          <Select
            label="Fuel Type"
            value={car.fuel_type}
            onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            options={["Gasoline", "Diesel", "Electric"]}
          />

          <Input
            label="Seating Capacity"
            type="number"
            placeholder="5"
            value={car.seat_capacity}
            onChange={(e) => setCar({ ...car, seat_capacity: e.target.value })}
          />
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Fitur Mobil</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "ac", label: "AC" },
              { key: "audio", label: "Audio" },
              { key: "bluetooth", label: "Bluetooth" },
              { key: "usbPort", label: "USB Port" },
              { key: "rearCamera", label: "Kamera Mundur" },
              { key: "parkingSensor", label: "Sensor Parkir" },
              { key: "abs", label: "ABS" },
              { key: "gps", label: "GPS" },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer
      ${
        car.features[item.key]
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200"
      }
    `}
              >
                <input
                  type="checkbox"
                  name={item.key}
                  checked={car.features[item.key]}
                  onChange={handleFeatureChange}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-sm font-medium">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <Input
          label="Location"
          value={car.location}
          onChange={(e) => setCar({ ...car, location: e.target.value })}
        />

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-800 mb-2">
            Description
          </label>
          <textarea
            rows="4"
            className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Describe the car condition, features, etc."
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            <img src={assets.tick_icon} alt="" className="w-5" />
            {isLoading ? "Adding..." : `Add Car`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;

/* ---------- Reusable Components ---------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block font-semibold text-gray-800 mb-2">{label}</label>
    <input
      {...props}
      required
      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block font-semibold text-gray-800 mb-2">{label}</label>
    <select
      {...props}
      required
      className="w-full rounded-xl border border-gray-300 p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
