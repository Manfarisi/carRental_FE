import React from 'react'
import Title from './Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
    const navigate = useNavigate()
    const {cars} = useAppContext()
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">

        <Title 
            title="Recent Vehicles Updated" 
            subTitle="Explore our selection of premium vehicles available for your next adventure."
        />

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {cars.slice(0,6).map((car)=>(
                <div key={car._id}>
                    <CarCard car={car}/>
                </div>
            ))}
        </div>

        {/* BUTTON */}
        <button 
            onClick={() => { navigate('/cars'); scrollTo(0,0) }}
            className="flex items-center gap-2 mx-auto mt-10 bg-blue-600 hover:bg-blue-700 
                       text-white px-6 py-3 rounded-xl transition-all duration-200 
                       shadow-md hover:shadow-lg"
        >
            Explore all cars 
            <img src={assets.arrow_icon} alt="arrow" className="w-4 invert" />
        </button>

    </div>
  )
}

export default FeaturedSection
