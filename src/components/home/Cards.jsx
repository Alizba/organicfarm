import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const cardData = [
  { title: 'Organic Vegetable', subtitle: 'Explore seasonal', tag: 'Best for health', href: '/shop/vegetables', img: '/images/card2.png', imgSize: 300 },
  { title: 'Organic Vegetable', subtitle: 'Explore seasonal', tag: 'Best for health', href: '/shop/vegetables', img: '/images/card1.png', imgSize: 300 },
  { title: 'Organic Fruits',    subtitle: 'Explore seasonal', tag: 'Best for health', href: '/shop/fruits',     img: '/images/card3.png', imgSize: 250 },
]

const Cards = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-5 py-10 px-4 md:px-10 lg:px-16">
      {cardData.map((card, i) => (
        <div key={i} className="group relative w-full md:w-1/3 rounded-2xl h-52 md:h-64 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-[url('/images/backgroundCards.jpg')] bg-cover bg-no-repeat blur-sm group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex justify-between items-center h-full px-4">
            <div className="py-6 pl-2">
              <h3 className="text-orange-400 text-sm md:text-base font-semibold whitespace-nowrap">{card.subtitle}</h3>
              <h1 className="font-bold text-lg md:text-2xl whitespace-nowrap">{card.title}</h1>
              <h4 className="text-gray-700 text-sm">{card.tag}</h4>
              <Link href={card.href} className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-2xl mt-4 font-semibold text-sm transition-colors duration-300">
                Shop all
              </Link>
            </div>
            <div className="shrink-0 group-hover:scale-105 transition-transform duration-500">
              <Image
                src={card.img}
                alt="card"
                width={card.imgSize}
                height={card.imgSize}
                className="w-28 h-28 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Cards