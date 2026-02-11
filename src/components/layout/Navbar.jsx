import Link from 'next/link'
import React from 'react'
import { SearchIcon, HeartIcon, ShoppingCart, User, Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <>
      <nav className='bg-white shadow-md sticky top-0 z-50'>
        
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-20'>
         
            <div className='shrink-0'>
              <Link href="/" className='text-3xl font-bold text-green-600 transition-colors'>
                BIO<span className='text-green-900'>PROX</span>
              </Link>
            </div>

            <div className='hidden md:flex items-center space-x-8'>
              <Link 
                href="/" 
                className='text-gray-700 hover:text-green-600 font-medium transition-colors relative group'
              >
                Home
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href="/shop" 
                className='text-gray-700 hover:text-green-600 font-medium transition-colors relative group'
              >
                Shop
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href="/gallery" 
                className='text-gray-700 hover:text-green-600 font-medium transition-colors relative group'
              >
                Gallery
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href="/blog" 
                className='text-gray-700 hover:text-green-600 font-medium transition-colors relative group'
              >
                Blog
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href="/pages" 
                className='text-gray-700 hover:text-green-600 font-medium transition-colors relative group'
              >
                Pages
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300'></span>
              </Link>
            </div>

            {/* Right Side Icons & Actions */}
            <div className='hidden md:flex items-center space-x-6'>
              {/* Search Icon */}
              <button 
                className='text-gray-700 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
                aria-label='Search'
              >
                <SearchIcon className='w-5 h-5' />
              </button>

              {/* Wishlist Icon */}
              <button 
                className='text-gray-700 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-full relative'
                aria-label='Wishlist'
              >
                <HeartIcon className='w-5 h-5' />
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  2
                </span>
              </button>

              {/* Cart Icon */}
              <button 
                className='text-gray-700 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-full relative'
                aria-label='Shopping Cart'
              >
                <ShoppingCart className='w-5 h-5' />
                <span className='absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  3
                </span>
              </button>

              {/* Login Button */}
              <Link 
                href="/login"
                className='flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg'
              >
                <User className='w-4 h-4' />
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className='md:hidden text-gray-700 hover:text-green-600 p-2'
              aria-label='Mobile Menu'
            >
              <Menu className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu (Hidden by default - add state management for toggle) */}
        <div className='md:hidden border-t border-gray-200'>
          <div className='px-4 py-4 space-y-3'>
            <Link 
              href="/" 
              className='block text-gray-700 hover:text-green-600 font-medium py-2 hover:bg-gray-50 px-3 rounded transition-colors'
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className='block text-gray-700 hover:text-green-600 font-medium py-2 hover:bg-gray-50 px-3 rounded transition-colors'
            >
              Shop
            </Link>
            <Link 
              href="/gallery" 
              className='block text-gray-700 hover:text-green-600 font-medium py-2 hover:bg-gray-50 px-3 rounded transition-colors'
            >
              Gallery
            </Link>
            <Link 
              href="/blog" 
              className='block text-gray-700 hover:text-green-600 font-medium py-2 hover:bg-gray-50 px-3 rounded transition-colors'
            >
              Blog
            </Link>
            <Link 
              href="/pages" 
              className='block text-gray-700 hover:text-green-600 font-medium py-2 hover:bg-gray-50 px-3 rounded transition-colors'
            >
              Pages
            </Link>
            
            {/* Mobile Actions */}
            <div className='pt-4 border-t border-gray-200 flex items-center justify-around'>
              <button className='text-gray-700 hover:text-green-600 p-2'>
                <SearchIcon className='w-5 h-5' />
              </button>
              <button className='text-gray-700 hover:text-green-600 p-2 relative'>
                <HeartIcon className='w-5 h-5' />
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>2</span>
              </button>
              <button className='text-gray-700 hover:text-green-600 p-2 relative'>
                <ShoppingCart className='w-5 h-5' />
                <span className='absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>3</span>
              </button>
              <Link 
                href="/login"
                className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-medium'
              >
                <User className='w-4 h-4' />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar