"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingCart, User, Menu, X, UserIcon } from 'lucide-react'
import Button from '../ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ShopInterestModal from '@/components/home/ShopInterestModal'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { cart } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const handleCartClick = () => router.push('/cart')

  const NAV_LINKS = ["Home", "Shop", "Gallery", "Blog", "Pages"]

  const getHref = (item) => item === "Home" ? "/" : `/${item.toLowerCase()}`

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">

          <Link href="/" className="text-2xl md:text-3xl font-bold text-green-600 whitespace-nowrap">
            BIO<span className='text-green-800'>PROX</span>
          </Link>

          <div className="hidden md:flex flex-1 lg:gap-8 md:gap-5 items-center">
            {NAV_LINKS.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                className="text-gray-700 font-medium hover:text-green-800 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </Link>
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-700 hover:text-green-900 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-800 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
            >
              Want to Sell? 
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" aria-label="Search">
              <Search size={20} />
            </button>

            <button onClick={handleCartClick} className="relative cursor-pointer text-gray-700 hover:text-green-800 transition-colors">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user?.role === "admin" ? "/roles/admin" : "/roles/shopkeeper"}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="cursor-pointer flex items-center gap-1">
                  <UserIcon size={16} />
                </Button>
              </Link>
            )}

            <button
              className="md:hidden p-2 text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={toggleMobileMenu} />
        )}

        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={toggleMobileMenu} className="p-2 hover:bg-gray-100 rounded-md">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col p-4 border-b border-gray-200">
            {NAV_LINKS.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                onClick={toggleMobileMenu}
                className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
              >
                {item}
              </Link>
            ))}
            <button
              onClick={() => { toggleMobileMenu(); setIsModalOpen(true); }}
              className="px-4 py-3 text-green-700 font-semibold hover:bg-green-50 rounded-md transition-colors text-left"
            >
              Want to Sell? ✨
            </button>
          </div>

          <div className="flex flex-col p-4 gap-3">
            <button
              onClick={() => { handleCartClick(); toggleMobileMenu(); }}
              className="relative flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  href={user?.role === "admin" ? "/roles/admin" : "/roles/shopkeeper"}
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-2 px-4 py-3 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors"
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => { logout(); toggleMobileMenu(); }}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                <User size={18} />
                <span>Staff Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ShopInterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default Navbar