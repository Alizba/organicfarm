
import Image from "next/image";

export default function CategoryCard({ title, image }) {
  return (
    <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl p-6 text-center hover:border-green-700 transition-all duration-300 cursor-pointer group h-full flex flex-col">
      <div className="relative w-full h-40 mb-4 flex items-center justify-center ">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain group-hover:scale-115 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </div>
      
      <h3 className="mt-auto text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
        {title}
      </h3>
    </div>
  );
}