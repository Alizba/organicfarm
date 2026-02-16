import React from 'react'
import Image from 'next/image'
import { farmers } from "../../lib/data/help"
import ProgressBar from '../ui/ProgressBar'

const Data = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="font-serif text-xs uppercase tracking-wide text-orange-400">
                Agricultural Development Program
              </p>
              <h1 className="text-4xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Fundraising to save rare crops and help farmers
              </h1>
            </div>

            <div className="flex gap-6 flex-wrap">
              <div className=" px-6 py-4 ">
                <p className="text-2xl font-bold text-emerald-600">300+</p>
                <p className="text-sm text-gray-600">Programs</p>
              </div>
              <div className=" px-6 py-4 ">
                <p className="text-2xl font-bold text-emerald-600">100+</p>
                <p className="text-sm text-gray-600">Donations</p>
              </div>
              <div className=" px-6 py-4 ">
                <p className="text-2xl font-bold text-emerald-600">10k</p>
                <p className="text-sm text-gray-600">Volunteers</p>
              </div>
            </div>

            <div className="space-y-4">
              {farmers.map(item => {
                const progress = Math.round(
                  (item.completed / item.targeted) * 100
                )

                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {item.title}
                    </h4>
                    
                    <div className="flex justify-between items-center mb-2 text-sm">
                     
                      <span className="font-bold text-emerald-700">
                        {progress}%
                      </span>
                    </div>

                    <ProgressBar value={progress} />
                  </div>
                )
              })}
            </div>
          </div>

            <div className="relative h-125 lg:h-150 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/helpBg.jpg" 
              alt="Farmers working in agricultural field"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>

        </div>
      </div>
    </section>
  )
}

export default Data