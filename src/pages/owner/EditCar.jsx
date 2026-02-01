import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();

  const [images, setImages] = useState([]); // gambar BARU
  const [existingImages, setExistingImages] = useState([]); // gambar LAMA
  const [isLoading, setIsLoading] = useState(false);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seat_capacity: "",
    location: "",
    description: "",
    features:"",
    licensePlate:"",
    category:"",
  });

  // ================= FETCH CAR =================
  const fetchCar = async () => {
    try {
      const { data } = await axios.get(`/api/owner/car/${id}`);

      if (data.success) {
        const c = data.car;

        setCar({
          brand: c.brand || "",
          model: c.model || "",
          year: c.year || "",
          pricePerDay: c.pricePerDay || "",
          category: c.category || "",
          transmission: c.transmission || "",
          fuel_type: c.fuel_type || "",
          seat_capacity: c.seat_capacity || "",
          location: c.location || "",
          description: c.description || "",
          features: c.features || "",
          category: c.category || "",
          licensePlate: c.licensePlate || "",
        });

        setExistingImages(c.images || []);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= UPDATE =================
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      // append images jika ada
      images.forEach((img) => {
        formData.append("images", img);
      });

      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.put(
        `/api/owner/update-car/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Car updated successfully");
        setImages([]);
        navigate("/owner/manage-cars");
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

  useEffect(() => {
    fetchCar();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title title="Edit Car" subTitle="Update car details" />

      <form
        onSubmit={onSubmitHandler}
        className="mt-6 bg-white rounded-2xl shadow-lg p-6 space-y-8"
      >
        {/* ================= IMAGES ================= */}
        <div>
          <p className="font-semibold text-gray-800 mb-2">Car Images</p>

          <label
            htmlFor="car-image"
            className="border-2 border-dashed border-blue-400 rounded-xl p-6 flex flex-wrap gap-4 cursor-pointer hover:bg-blue-50 transition"
          >
            {images.length === 0
  ? existingImages.map((img, i) => (
      <img
        key={i}
        src={img}   // ⬅ LANGSUNG PAKAI
        className="w-28 h-20 object-cover rounded-lg"
      />
    ))
  : images.map((img, i) => (
      <img
        key={i}
        src={URL.createObjectURL(img)}
        className="w-28 h-20 object-cover rounded-lg"
      />
    ))}

          </label>

          <input
            type="file"
            id="car-image"
            accept="image/*"
            multiple
            hidden
            onChange={(e) =>
              setImages(Array.from(e.target.files).slice(0, 5))
            }
          />

          <p className="text-sm text-gray-500 mt-2">
            Upload new images (optional)
          </p>
        </div>

        {/* ================= BRAND & MODEL ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Brand"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
          />
          <Input
            label="Model"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          />
        </div>

        {/* ================= YEAR / PRICE / CATEGORY ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Year"
            type="number"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
          />
          <Input
            label={`Daily Price (${currency})`}
            type="number"
            value={car.pricePerDay}
            onChange={(e) =>
              setCar({ ...car, pricePerDay: e.target.value })
            }
          />
          <Input
            label="License Plate"
            value={car.licensePlate}
            onChange={(e) => setCar({ ...car, licensePlate: e.target.value })}
          />
        </div>

        {/* ================= TRANSMISSION ================= */}
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
            options={["Automatic", "Manual"]}
            onChange={(e) =>
              setCar({ ...car, transmission: e.target.value })
            }
          />
          <Select
            label="Fuel Type"
            value={car.fuel_type}
            options={["Gasoline", "Diesel", "Electric"]}
            onChange={(e) =>
              setCar({ ...car, fuel_type: e.target.value })
            }
          />

          <Input
            label="Seating Capacity"
            type="number"
            value={car.seating_capacity}
            onChange={(e) =>
              setCar({ ...car, seating_capacity: e.target.value })
            }
          />
        </div>

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

        {/* ================= LOCATION ================= */}
        <Input
          label="Location"
          value={car.location}
          onChange={(e) => setCar({ ...car, location: e.target.value })}
        />

        {/* ================= DESCRIPTION ================= */}
        <div>
          <label className="block font-semibold text-gray-800 mb-2">
            Description
          </label>
          <textarea
            rows="4"
            className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
            value={car.description}
            onChange={(e) =>
              setCar({ ...car, description: e.target.value })
            }
          />
        </div>

        {/* ================= SUBMIT ================= */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60"
          >
            <img src={assets.tick_icon} className="w-5" />
            {isLoading ? "Updating..." : "Update Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCar;

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block font-semibold text-gray-800 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block font-semibold text-gray-800 mb-2">
      {label}
    </label>
    <select
      {...props}
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
