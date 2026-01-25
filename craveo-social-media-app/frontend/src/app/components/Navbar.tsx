'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaSearch, FaBell, FaUser, FaBars, FaTimes,
  FaHome, FaCompass, FaPlusCircle
} from 'react-icons/fa'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {/* Use your logo */}
              <div className="relative w-20 h-20">
                <Image 
                  src="/images/logo/logo.png" 
                  alt="Craveo Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search for dishes, recipes, or chefs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B9F20] focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/feed" className="text-gray-700 hover:text-[#1B9F20] transition-colors">
              <FaHome className="w-5 h-5" />
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-[#1B9F20] transition-colors">
              <FaCompass className="w-5 h-5" />
            </Link>
            <Link href="/create" className="text-gray-700 hover:text-[#1B9F20] transition-colors">
              <FaPlusCircle className="w-5 h-5" />
            </Link>
            
            <button className="relative p-2 text-gray-700 hover:text-[#1B9F20] transition-colors">
              <FaBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#1B9F20] rounded-full"></span>
            </button>
            
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <FaUser className="w-4 h-4 text-[#1B9F20]" />
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6 text-gray-700" />
            ) : (
              <FaBars className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-4 border-t border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search for dishes, recipes, or chefs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B9F20] focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/feed" className="flex items-center space-x-3 text-gray-700 hover:text-[#1B9F20] transition-colors py-2">
                <FaHome className="w-5 h-5" />
                <span>Feed</span>
              </Link>
              <Link href="/explore" className="flex items-center space-x-3 text-gray-700 hover:text-[#1B9F20] transition-colors py-2">
                <FaCompass className="w-5 h-5" />
                <span>Explore</span>
              </Link>
              <Link href="/create" className="flex items-center space-x-3 text-gray-700 hover:text-[#1B9F20] transition-colors py-2">
                <FaPlusCircle className="w-5 h-5" />
                <span>Create</span>
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <FaBell className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Notifications</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <FaUser className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
