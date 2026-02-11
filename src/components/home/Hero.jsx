import React from 'react'
import Link from 'next/link'
import { Leaf, ShoppingBag, ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <>
      <section className='relative bg-[url("/images/hero.png")] bg-cover bg-center bg-no-repeat min-h-150 md:min-h-175'>
        <div className='absolute inset-0 bg-linear-to-r from-black/60 via-black/50 to-transparent'></div>
        
        <div className='relative container mx-auto px-4 h-full min-h-150 md:min-h-175 flex items-center'>
          <div className='max-w-2xl text-white py-20'>
            <div className='inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2 mb-6'>
              <Leaf className='w-4 h-4 text-green-400' />
              <span className='text-sm font-medium text-green-300'>100% Organic & Natural</span>
            </div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              Environment Friendly
              <span className='block text-green-400 mt-2'>Organic Farm</span>
            </h1>

            <p className='text-lg md:text-xl text-gray-200 mb-8 leading-relaxed'>
              Discover fresh, pesticide-free produce grown with care for you and the planet. 
              Experience the difference of truly organic farming.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>🌱</span>
                </div>
                <div>
                  <p className='font-semibold'>100% Organic</p>
                  <p className='text-sm text-gray-300'>No Chemicals</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>🚚</span>
                </div>
                <div>
                  <p className='font-semibold'>Fast Delivery</p>
                  <p className='text-sm text-gray-300'>Same Day</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>✓</span>
                </div>
                <div>
                  <p className='font-semibold'>Certified</p>
                  <p className='text-sm text-gray-300'>USDA Organic</p>
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Link 
                href="/shop"
                className='inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105'
              >
                <ShoppingBag className='w-5 h-5' />
                Shop Now
                <ArrowRight className='w-5 h-5' />
              </Link>
              
              <Link 
                href="/about"
                className='inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-all'
              >
                Learn More
              </Link>
            </div>

            <div className='flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20'>
              <div>
                <p className='text-3xl font-bold text-green-400'>500+</p>
                <p className='text-sm text-gray-300'>Products</p>
              </div>
              <div>
                <p className='text-3xl font-bold text-green-400'>10K+</p>
                <p className='text-sm text-gray-300'>Happy Customers</p>
              </div>
              <div>
                <p className='text-3xl font-bold text-green-400'>15+</p>
                <p className='text-sm text-gray-300'>Years Experience</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  )
}

export default Hero