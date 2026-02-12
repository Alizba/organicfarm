import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, ArrowRight, Apple, Carrot, Sprout } from 'lucide-react'

const Hero = () => {
  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0 pointer-events-none opacity-20'>
        <Leaf className='absolute top-20 left-10 w-16 h-16 lg:w-24 lg:h-24 text-green-600 rotate-45 animate-pulse' />
        <Apple className='absolute top-40 left-32 w-12 h-12 lg:w-16 lg:h-16 text-green-600 -rotate-12' />
        <Carrot className='absolute bottom-32 left-20 w-16 h-16 lg:w-20 lg:h-20 text-orange-600 rotate-12' />
        <Sprout className='absolute top-1/2 left-1/4 w-20 h-20 lg:w-28 lg:h-28 text-green-300 -rotate-45' />
        <Leaf className='absolute bottom-20 left-1/3 w-16 h-16 lg:w-20 lg:h-20 text-green-600 rotate-90' />
      </div>

      <div className='absolute inset-0 bg-linear-to-br from-green-50/30 via-transparent to-green-100/20 pointer-events-none' />
      
      <div className='relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20'>
        <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12'>
          
          <div className='w-full lg:w-1/2 z-10 text-center lg:text-left'>

            <div className='inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2 mb-6'>
              <Leaf className='w-4 h-4 text-green-700' />
              <span className='text-sm font-medium text-green-700'>100% Organic & Natural</span>
            </div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900'>
              Environment Friendly
              <span className='block text-green-600 mt-2'>Organic Farm</span>
            </h1>

            <p className='text-base sm:text-lg md:text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0'>
              Discover fresh, pesticide-free produce grown with care for you and the planet.
              Experience the difference of truly organic farming.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start md:w-3/4 w-1/2 m-auto lg:w-full'>
              <Link
                href="/shop"
                className='inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105'
              >
                Shop Now
                <ArrowRight className='w-5 h-5' />
              </Link>

              <Link
                href="/about"
                className='inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all '
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className='relative w-full lg:w-1/2 flex items-center justify-center min-h-100 sm:min-h-125 lg:min-h-150'>
            <div className='relative w-full h-full max-w-md lg:max-w-full'>
              <div className='relative w-full h-full min-h-100 sm:min-h-125 lg:min-h-150'>
                <Image
                  src="/images/veges.png"
                  alt='Fresh organic vegetables'
                  fill
                  className='object-contain'
                  priority
                />
              </div>

              <div className='hidden lg:block absolute top-0 left-0 lg:-top-4 lg:-left-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 z-10'>
                <Image
                  src="/images/leaves.png"
                  alt='decorative leaves'
                  fill
                  className='object-contain'
                />
              </div>

              <div className='hidden lg:block absolute lg:-bottom-14 lg:-right-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 z-10'>
                <Image
                  src="/images/leaves.png"
                  alt='decorative leaves'
                  fill
                  className='object-contain'
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero