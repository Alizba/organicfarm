import React from 'react'
import Image from 'next/image'

const Cards = () => {
    return (
        <>
            <section className=' flex items-center justify-center gap-10 py-10 mx-15'>
                <div className='group relative w-1/3 rounded-2xl h-65 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300'>
                    <div className='absolute inset-0 bg-[url(/images/backgroundCards.jpg)] bg-cover bg-no-repeat blur-sm  group-hover:scale-110 transition-transform duration-700'></div>
                    <div className='relative z-10 flex justify-center items-center h-full'>
                        <div className='pl-6 py-10'>
                            <h3 className='text-orange-400 text-xl text-nowrap font-semibold'>Explore seasonal</h3>
                            <h1 className='font-bold text-2xl text-nowrap'>Organic Vegetable</h1>
                            <h4 className='text-gray-700'>Best for health</h4>
                            <button className='bg-green-600 px-6 py-2 rounded-2xl my-6 hover:bg-green-700 transitions-colors duration-300 cursor-pointer text-white font-semibold'>shop all </button>
                        </div>
                        <div className='group-hover:scale-110 transition-transform duration-500'>
                            <Image src="/images/card2.png"
                            alt='cardImg'
                            width={300}
                            height={300}/>
                        </div>
                    </div>
                </div>

                <div className='group relative w-1/3 rounded-2xl h-65 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300'>
                    <div className='absolute inset-0 bg-[url(/images/backgroundCards.jpg)] bg-cover bg-no-repeat blur-sm group-hover:scale-110 transition-transform duration-700'></div>
                    <div className='relative z-10 flex justify-center items-center h-full'>
                        <div className='pl-6 py-10'>
                            <h3 className='text-orange-400 text-xl text-nowrap font-semibold'>Explore seasonal</h3>
                            <h1 className='font-bold text-2xl text-nowrap'>Organic Vegetable</h1>
                            <h4 className='text-gray-700'>Best for health</h4>
                            <button className='bg-green-600 px-6 py-2 rounded-2xl my-6 hover:bg-green-700 transitions-colors duration-300 cursor-pointer text-white font-semibold'>shop all </button>
                        </div>
                        <div className='group-hover:scale-110 transition-transform duration-500'>
                            <Image src="/images/card1.png"
                            alt='cardImg'
                            width={300}
                            height={300}/>
                        </div>
                    </div>
                </div>

                <div className='group relative w-1/3 rounded-2xl h-65 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300'>
                    <div className='absolute inset-0 bg-[url(/images/backgroundCards.jpg)] bg-cover bg-no-repeat blur-sm group-hover:scale-110 transition-transform duration-700'></div>
                    <div className='relative z-10 flex justify-center items-center h-full'>
                        <div className='pl-6 py-10'>
                            <h3 className='text-orange-400 text-xl text-nowrap font-semibold'>Explore seasonal</h3>
                            <h1 className='font-bold text-2xl text-nowrap'>Organic Vegetable</h1>
                            <h4 className='text-gray-700'>Best for health</h4>
                            <button className='bg-green-600 px-6 py-2 rounded-2xl my-6 hover:bg-green-700 transitions-colors duration-300 cursor-pointer text-white font-semibold'>shop all </button>
                        </div>
                        <div className='group-hover:scale-110 transition-transform duration-500'>
                            <Image src="/images/card3.png"
                            alt='cardImg'
                            width={300}
                            height={300}/>
                        </div>
                    </div>
                </div>


            </section>
        </>
    )
}

export default Cards