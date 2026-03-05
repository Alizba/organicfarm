import Image from "next/image";

export default function DealCard({ title, image, Category, price, weight }) {
  return (
    <div className="group relative bg-linear-to-br from-white/30 to-white/40  rounded-3xl p-6 border border-green-600 transition-all duration-500 cursor-pointer h-full flex flex-col">
      
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      {Category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-linear-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
            {Category}
          </span>
        </div>
      )}

      <div className="relative w-full h-48 mb-6 flex items-center justify-center rounded-2xl">
        <div className="relative w-full h-full p-4">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        
        <div className="absolute inset-0 bg-linear-to-t from-green-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="mt-auto space-y-3 relative z-10">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 leading-tight line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
          {weight && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span className="text-sm font-medium text-gray-600">{weight}</span>
            </div>
          )}

          {price && (
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-green-700 group-hover:text-green-600 transition-colors">
                Rs. {price}
              </span>
            </div>
          )}
        </div>

        <button className="cursor-pointer w-full py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl">
          Add to Cart
        </button>
      </div>
    </div>
  );
}