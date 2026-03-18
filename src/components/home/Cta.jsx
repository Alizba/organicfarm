import React from 'react'
import Image from 'next/image'
import { LeafIcon, PhoneCall, Vegan, Trees, Citrus } from 'lucide-react'
import Button from '../ui/Button'
import Link from 'next/link'

const features = [
  { icon: LeafIcon, text: 'Quality Vegetables' },
  { icon: Vegan,    text: 'Smooth & Firm'      },
  { icon: Trees,    text: 'Organically Green'  },
  { icon: Citrus,   text: 'Chemical Free'      },
]

const Cta = () => {
  return (
    <div className="relative my-10 overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-[url('/images/ctaBackGround.jpg')] bg-cover bg-center" />

      <div className="relative flex flex-col md:flex-row items-center py-12 px-6 md:py-16 md:px-12 gap-8">

        {/* Image — shows on top on mobile */}
        <div className="w-full md:w-1/2 flex justify-center items-center order-first md:order-0">
          <div className="relative group">
            <Image
              src="/images/flashVeges.png"
              alt="Fresh organic vegetables"
              width={500}
              height={500}
              className="relative drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 w-52 h-52 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-120 lg:h-120 object-contain"
            />
          </div>
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="font-light text-green-700 tracking-wider uppercase text-sm flex items-center gap-2">
                <span className="w-12 h-px bg-green-700 inline-block" />
                Nutrition Rich Products
              </p>
              <h1 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight">
                Ready for Instant and<br />
                <span className="text-green-700">Convenient Use</span>
              </h1>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base w-full md:w-4/5">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed praesentium pariatur
                eveniet nesciunt sint commodi ex eaque illum odit atque officia reiciendis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 w-full md:w-3/4">
              {features.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="p-2 border border-green-700 rounded-full shrink-0">
                    <Icon className="w-4 h-4 text-green-700" strokeWidth={2.5} />
                  </div>
                  <span className="font-medium text-gray-800 text-xs md:text-sm">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
              <Button className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/shop">Shop now</Link>
              </Button>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="p-3 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors">
                  <PhoneCall className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Call us Anytime</p>
                  <p className="text-base font-bold text-gray-900">+92 344 6593349</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cta