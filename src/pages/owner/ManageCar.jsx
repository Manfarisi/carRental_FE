import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const ManageCar = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();


  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm("Are You Sure Want Delete Car?");
      if (!confirm) return null;
      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Title title="Manage Cars" />

      <div className="mt-8 max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full border-collapse">
          {/* HEADER */}
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-lg font-semibold text-gray-700">
              <th className="px-8 py-5">Car</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {cars.map((car, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-50 hover:shadow-md transition-all"
              >
                {/* CAR */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <img
                      src={car.images[0] || assets.placeholder_car}
                      alt={car.model}
                      className="w-28 h-20 rounded-xl object-cover border shadow-sm"
                    />
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-base text-gray-500">
                        {car.seating_capacity} seats • {car.transmission}
                      </p>
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="px-8 py-6 text-lg font-medium text-gray-800">
                  {car.category}
                </td>

                {/* PRICE */}
                <td className="px-8 py-6 text-xl font-bold text-gray-900">
                  {currency}
                  {car.pricePerDay}
                  <span className="text-base font-normal text-gray-500">
                    {" "}
                    / day
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-8 py-6">
                  <span
                    className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-bold
                      ${
                        car.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    <span
                      className={`w-3 h-3 rounded-full
                        ${car.isAvailable ? "bg-green-500" : "bg-red-500"}
                      `}
                    />
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-8 py-6">
                  <div className="flex justify-center gap-5">
                    {/* TOGGLE AVAILABILITY */}
                    <button
                      onClick={() => toggleAvailability(car._id)}
                      title="Toggle availability"
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl text-base font-semibold
        transition-all shadow-sm hover:shadow-md hover:scale-105
        ${
          car.isAvailable
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
                    >
                      <img
                        src={
                          car.isAvailable
                            ? assets.eye_close_icon
                            : assets.eye_icon
                        }
                        alt="toggle"
                        className="w-7 h-7"
                      />
                      <span>{car.isAvailable ? "Hide" : "Show"}</span>
                    </button>

                    {/* Edit */}
                    <button
  onClick={() => navigate(`/owner/edit-car/${car._id}`)}
  title="Edit car"
  className="flex items-center gap-3 px-5 py-3 rounded-xl text-base font-semibold
  bg-blue-100 text-blue-700 hover:bg-blue-200
  transition-all shadow-sm hover:shadow-md hover:scale-105"
>
  <img
    src={assets.edit_icon}
    alt="edit"
    className="w-7 h-7"
  />
  <span>Edit</span>
</button>


                    {/* DELETE */}
                    <button
                      onClick={() => deleteCar(car._id)}
                      title="Delete car"
                      className="flex items-center gap-3 px-5 py-3 rounded-xl text-base font-semibold
        bg-red-100 text-red-700 hover:bg-red-200
        transition-all shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <img
                        src={assets.delete_icon}
                        alt="delete"
                        className="w-7 h-7"
                      />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cars.length === 0 && (
          <div className="py-14 text-center text-lg text-gray-500">
            No cars found
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCar;
