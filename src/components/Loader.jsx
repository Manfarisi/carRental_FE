import React from 'react'

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-600 text-sm tracking-wide">
          Loading...
        </p>

      </div>
    </div>
  )
}

export default Loader
