import Image from "next/image";

export default function CategoryCard({ title, image }) {
  return (
    <div className="bg-gray-100 rounded-3xl p-6 text-center hover:shadow-lg transition">
      <Image
        src={image}
        alt={title}
        width={200}
        height={200}
        className="mx-auto"
      />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    </div>
  );
}
