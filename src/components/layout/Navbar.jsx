"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingCart, User, Menu, X, User2Icon } from 'lucide-react'
import Button from '../ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { cart } = useCart();
  const router = useRouter();

  const isLoggedIn = false;

  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push("/cart")
    }
    else {
      router.push("/login")
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">

        <Link href="/" className="text-2xl md:text-3xl font-bold text-green-600 whitespace-nowrap">
          BIO<span className='text-green-800'>PROX</span>
        </Link>

        <div className="hidden md:flex flex-1 lg:gap-8 md:gap-5 ">
          <Link href="/" className="text-gray-700 font-medium hover:text-green-800 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full">
            Home
          </Link>
          <Link href="/shop" className="text-gray-700 font-medium hover:text-green-800 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full">
            Shop
          </Link>
          <Link href="/gallery" className="text-gray-700 font-medium hover:text-green-800 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full">
            Gallery
          </Link>
          <Link href="/blog" className="text-gray-700 font-medium hover:text-green-800 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full">
            Blog
          </Link>
          <Link href="/pages" className="text-gray-700 font-medium hover:text-green-800 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full">
            Pages
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button onClick={handleCartClick} className="relative cursor-pointer">
            <ShoppingCart size={20} />

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>


          <Link href="/login">
            <Button className='cursor-pointer'>Login</Button>
          </Link>
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
        )}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={toggleMobileMenu} className="p-2 hover:bg-gray-100 rounded-md">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col p-4 border-b border-gray-200">
          <Link
            href="/"
            onClick={toggleMobileMenu}
            className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={toggleMobileMenu}
            className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/gallery"
            onClick={toggleMobileMenu}
            className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            onClick={toggleMobileMenu}
            className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/pages"
            onClick={toggleMobileMenu}
            className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
          >
            Pages
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex flex-col p-4 gap-2">

          <button onClick={handleCartClick} className="relative">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>

          <Link
            href="/login"
            onClick={toggleMobileMenu}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors mt-2"
          >
            <User size={18} />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar