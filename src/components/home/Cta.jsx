import React from 'react'
import Image from 'next/image'
import {LeafIcon, PhoneCall, Vegan, Trees, Citrus} from 'lucide-react'
import Button from '../ui/Button'

const Cta = () => {
  return (
    <>
    <div className='relative my-10 overflow-hidden shadow-xl'>
        <div className='absolute inset-0 bg-[url(/images/ctaBackGround.jpg)] bg-cover bg-center'></div>
        
        <div className='relative flex py-16 px-8 items-center'>
            
            <div className='w-1/2 flex justify-center items-center'>
                <div className='relative group'>
                    <div className='absolute -inset-4 shadow-2xl rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500'></div>
                    <Image
                        src="/images/cta.png"
                        alt='Fresh organic vegetables'
                        width={550}
                        height={550}
                        className='relative drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    />
                </div>
            </div>
            
           
            <div className='w-1/2 pr-8'>
                <div className='space-y-6'>
                    <div className='space-y-3'>
                        <p className='font-light text-green-700 tracking-wider uppercase text-sm flex items-center gap-2'>
                            <span className='w-12 h-px bg-green-700'></span>
                            Nutrition Rich Products
                        </p>
                        <h1 className='font-bold text-4xl text-gray-900 leading-tight'>
                            Ready for Instant and<br />
                            <span className='text-green-700'>Convenient Use</span>
                        </h1>
                        <p className='w-4/5 text-gray-600 leading-relaxed'>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed praesentium pariatur eveniet nesciunt sint commodi ex eaque illum odit atque officia reiciendis
                        </p>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4 py-4 w-3/4'>
                        {[
                            { icon: LeafIcon, text: 'Quality Vegetables' },
                            { icon: Vegan, text: 'Smooth & Firm' },
                            { icon: Trees, text: 'Organically Green' },
                            { icon: Citrus, text: 'Chemical Free' }
                        ].map((item, index) => (
                            <div 
                                key={index}
                                className='flex items-center gap-3 px-4 py-3  backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 group'
                            >
                                <div className='p-2 border-green-700 border  rounded-full transition-colors'>
                                    <item.icon className='w-5 h-5 text-green-700' strokeWidth={2.5} />
                                </div>
                                <h3 className='font-medium text-gray-800 text-sm'>{item.text}</h3>
                            </div>
                        ))}
                    </div>
                    
                    <div className='flex items-center gap-8 pt-4'>
                        <Button className='shadow-lg hover:shadow-xl transition-shadow'>
                            Shop now
                        </Button>
                        <div className='flex items-center gap-3 group cursor-pointer'>
                            <div className='p-3 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors'>
                                <PhoneCall className='w-5 h-5 text-emerald-600' strokeWidth={2} />
                            </div>
                            <div>
                                <p className='text-lg text-gray-500 font-medium'>Call us Anytime</p>
                                <p className='text-lg font-bold text-gray-900 transition-colors'>
                                    +92 344 6593349
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Cta