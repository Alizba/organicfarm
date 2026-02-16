import Image from "next/image";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ProductCard({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;


  return (
    <div className="bg-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-green-300 flex flex-col h-full">
      {/* Weight Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {product.weight}
        </span>

      </div>

      {/* Product Image */}
      <div className="relative w-full h-48 mb-4 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="grow border-t border-gray-300">


        {/* Product Name */}
        <h3 className="text-lg mt-2 font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-800">
            Rs. {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-5 items-center">

        {/* Vegetarian Badge */}
        {product.isVegetarian && (
          <div className="flex items-end mb-3">
            <div className="border-2 border-green-600 rounded-sm p-1 w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
          </div>
        )}

        <Button
          className="group bg-green-500 hover:bg-orange-400 transition-all duration-300 ease-in-out relative overflow-hidden"
        >
          <span className="group-hover:opacity-0 group-hover:scale-0 transition-all duration-300">
            Add to Cart
          </span>
          <ShoppingCart className="w-4 h-4 absolute opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Button>
      </div>


    </div>
  );
}