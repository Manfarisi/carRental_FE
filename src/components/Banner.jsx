import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-14 bg-linear-to-r from-blue-600 to-blue-400 
                    rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between 
                    gap-10 overflow-hidden mb-5">

        <div className="text-white max-w-lg space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold leading-snug">
                Do You Own A Luxury Car?
            </h2>

            <p className="opacity-90 text-base lg:text-lg">
                Monetize your vehicle effortlessly by listing it on CarMan Rental.
            </p>

            <p className="opacity-80 text-sm lg:text-base">
                We take care of insurance, driver verification and secure payments – so you can earn
                passive income, stress-free.
            </p>

            <button className="mt-4 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl 
                               shadow-md hover:shadow-xl hover:bg-gray-100 transition-all duration-200">
                List your car
            </button>
        </div>

        <img 
            src={assets.banner_car_image} 
            alt="car" 
            className="w-full max-w-md drop-shadow-xl"
        />
    </div>
  )
}

export default Banner
