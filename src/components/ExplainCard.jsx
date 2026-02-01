import React from "react";

const contents = [
  {
    title: "Wide Range of Quality Vehicles",
    subtitle: "Cars for every journey",
    points: [
      "Choose from city cars, SUVs, MPVs, luxury, and electric vehicles.",
      "All cars are regularly inspected, clean, and well-maintained.",
      "We partner only with trusted owners to ensure top quality.",
    ],
  },
  {
    title: "Transparent & Affordable Pricing",
    subtitle: "No hidden costs",
    points: [
      "Clear pricing with no surprise fees.",
      "Daily rates that fit your budget and needs.",
      "Flexible payment options including cash and bank transfer.",
    ],
  },
  {
    title: "Easy Booking & Reliable Support",
    subtitle: "Rent with confidence",
    points: [
      "Simple and fast booking process in just a few clicks.",
      "Flexible pickup and return locations.",
      "24/7 customer support ready to assist you anytime.",
    ],
  },
];

const ExplainSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Why Rent With Us
        </h2>
        <p className="text-gray-500 mt-3">
          Premium service designed for your comfort and peace of mind
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contents.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-8 
                       shadow-sm hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="mb-5">
              <div className="w-12 h-12 flex items-center justify-center 
                              rounded-xl bg-blue-50 text-blue-600 font-bold text-lg">
                {index + 1}
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.subtitle}
              </p>
            </div>

            {/* Points */}
            <ul className="space-y-3 text-gray-600">
              {item.points.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-blue-600 font-semibold">✔</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExplainSection;
