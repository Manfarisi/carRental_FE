import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image: assets.testimonial_image_1,
      testimonial:
        "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
    },
    {
      name: "John Wick",
      location: "Jakarta, Indonesia",
      image: assets.testimonial_image_2,
      testimonial:
        "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
    },
    {
      name: "Maria Nagai",
      location: "Tokyo, Japan",
      image: assets.testimonial_image_1,
      testimonial:
        "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
    },
  ];

  return (
    <div className="bg-linear-to-b from-[#eef3ff] to-[#f9fbff] py-24 px-6 md:px-16 lg:px-24 xl:px-44 bg-gray-50">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 
                       hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img key={index} src={assets.star_icon} alt="" />
                ))}
            </div>

            {/* testimonial text */}
            <p className="text-gray-600 leading-relaxed text-[15px] mt-2">
              {testimonial.testimonial}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
