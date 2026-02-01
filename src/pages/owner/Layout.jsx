import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate} = useAppContext()

  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Navbar */}
      <NavbarOwner />

      {/* Main Layout */}
      <div className="flex">

        {/* Sidebar */}
        <div className="w-72 shrink-0">
          <Sidebar />
        </div>

        {/* Page Content */}
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default Layout
