import React from 'react'
import { assets,  } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const {user} = useAppContext()

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      
      {/* LEFT – LOGO */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src={assets.logo}
          alt="Logo"
          className="h-8 w-auto object-contain"
        />
        <span className="hidden sm:block text-lg font-semibold text-gray-800">
          Owner Panel
        </span>
      </Link>

      {/* RIGHT – USER */}
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="text-sm font-semibold text-gray-800">
            {user?.name || 'Owner'}
          </p>
        </div>

        <img
          src={
            user?.image ||
            'https://images.unsplash.com/photo-1527980965255-d3b416303d12'
          }
          alt=""
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
      </div>
    </header>
  )
}

export default NavbarOwner
