'use client'

import React from 'react'
import Image from 'next/image'
import Button from '../ui/Button'

const Offers = () => {
    return (
        <section className='bg-linear-to-br from-orange-200 via-orange-300 to-orange-200 w-full my-16 py-12 px-6 shadow-lg overflow-hidden relative'>
            {/* Decorative background elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-20'></div>
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full blur-3xl opacity-20'></div>
            
            <div className='flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-8 relative z-10 mx-auto'>

                {/* Left Offer Card - Fruits */}
                <div className='flex flex-col sm:flex-row justify-center items-center gap-6 p-8 group w-full'>
                    <div className='relative'>
                        <Image 
                            src="/images/mixFruits.png"
                            alt='Fresh mixed fruits'
                            height={220}
                            width={220}
                            className='drop-shadow-2xl group-hover:rotate-6 transition-transform duration-300'
                        />
                    </div>
                    <div className='text-center sm:text-left space-y-3'>
                        <p className='text-xs font-semibold text-orange-600 uppercase tracking-widest italic opacity-70'>Shop for</p>
                        <h2 className='text-2xl font-bold text-gray-800 leading-tight'>FRESH FRUITS<br/>ONLINE</h2>
                        <p className='text-base font-semibold text-orange-500 flex items-center justify-center sm:justify-start gap-2'>
                      
                            Save up to <span className='text-xl text-orange-600'>40%</span>
                        </p>
                        <div className='pt-2'>
                            <Button className='transform hover:translate-y-0.5 transition-transform shadow-md hover:shadow-lg'>
                                View Items →
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Center Decorative Image */}
                <div className='hidden lg:block relative shrink-0'>
                    <div className='absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse'></div>
                    <Image
                        src="/images/waterLeaves.png"
                        alt='Fresh water splash with leaves'
                        width={220}
                        height={220}
                        className='relative z-10 drop-shadow-2xl animate-float'
                    />
                </div>

                {/* Right Offer Card - Vegetables */}
                <div className='flex flex-col sm:flex-row-reverse justify-center items-center gap-6 p-8 group w-full '>
                    <div className='relative'>
                        <Image 
                            src="/images/mixVeges.png"
                            alt='Fresh mixed vegetables'
                            height={250}
                            width={250}
                            className='drop-shadow-2xl group-hover:rotate-2 transition-transform duration-300'
                        />
                    </div>
                    <div className='text-center sm:text-left space-y-3'>
                        <p className='text-xs font-semibold text-green-600 uppercase tracking-widest italic opacity-70'>Shop for</p>
                        <h2 className='text-2xl font-bold text-gray-800 leading-tight'>FRESH VEGETABLES<br/>ONLINE</h2>
                        <p className='text-base font-semibold text-green-500 flex items-center justify-center sm:justify-start gap-2'>
                          
                            Save up to <span className='text-xl text-green-600'>40%</span>
                        </p>
                        <div className='pt-2'>
                            <Button className='transform hover:translate-y-0.5 transition-transform shadow-md hover:shadow-lg'>
                                View Items →
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Offers