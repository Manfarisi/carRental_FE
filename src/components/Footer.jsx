import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <footer className="
        bg-linear-to-b from-[#f9fbff] to-[#e8efff]
        flex flex-col items-center justify-center
        w-full py-16 px-6
        text-sm text-gray-700
      ">
        
        {/* Logo */}
        <img 
          src={assets.logo} 
          alt="Logo"
          className="w-32 opacity-90 hover:opacity-100 transition"
        />

        {/* Copyright */}
        <p className="mt-5 text-center text-gray-600 leading-relaxed">
          © 2025 <a href="https://carmanrental.com" className="font-medium text-blue-600 hover:text-blue-800">CarmanRental</a>.  
          All rights reserved.
        </p>

        {/* Link Row */}
        <div className="flex items-center gap-5 mt-6">
          <a 
            href="#" 
            className="font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            Brand Guidelines
          </a>

          <div className="h-5 w-px bg-gray-400/30"></div>

          <a 
            href="#" 
            className="font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            Trademark Policy
          </a>
        </div>

        {/* Bottom small detail line */}
        <div className="mt-10 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-gray-300/40 to-transparent"></div>

      </footer>
    </div>
  )
}

export default Footer
