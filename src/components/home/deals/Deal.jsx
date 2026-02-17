import React from 'react'
import Image from 'next/image'
import DealSlider from './DealSlider'
import Button from '@/components/ui/Button'

export const Deal = () => {
  return (
    <section
      className="relative py-12 px-4 md:px-8 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('./images/dealBg.jpg')" }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-0"></div>

      {/* Content */}
      <div className='relative z-10 flex flex-col lg:flex-row gap-8 items-center'>
        <div className="shrink-0 relative">
          <div className="relative">
            <Image
              src="/images/personHolds.jpg"
              alt='Person holding product'
              width={300}
              height={300}
              className="rounded-lg shadow-lg"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent rounded-lg flex flex-col justify-end p-6">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                Deal of the Day
              </h2>
              <p className="text-white/90 text-sm md:text-base mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div>
                <Button>Buy Now</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">
          <DealSlider 
          alt= "deal"/>
        </div>
      </div>
    </section>
  )
}