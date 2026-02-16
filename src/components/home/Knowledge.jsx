import { LeafyGreen, Truck, Shield, Headphones } from 'lucide-react'
import React from 'react'

const Knowledge = () => {
    const features = [
        {
            icon: LeafyGreen,
            title: "Fresh Vegetables",
            description: "Farm fresh vegetables delivered daily to ensure maximum freshness and nutritional value for your family.",
            color: "bg-green-100",
            iconColor: "text-green-600",
            hoverColor: "hover:bg-green-50"
        },
        {
            icon: Truck,
            title: "Free Delivery",
            description: "Fast and reliable delivery service right to your doorstep. Free shipping on orders over $50.",
            color: "bg-blue-100",
            iconColor: "text-blue-600",
            hoverColor: "hover:bg-blue-50"
        },
        {
            icon: Shield,
            title: "100% Secure Payment",
            description: "Your transactions are protected with industry-leading security measures for peace of mind.",
            color: "bg-purple-100",
            iconColor: "text-purple-600",
            hoverColor: "hover:bg-purple-50"
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "Our dedicated support team is always available to assist you with any questions or concerns.",
            color: "bg-orange-100",
            iconColor: "text-orange-600",
            hoverColor: "hover:bg-orange-50"
        }
    ]

    return (
        <section className="py-16 px-4 bg-linear-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the benefits that make us your trusted partner for fresh, quality products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className={`group ${feature.color} ${feature.hoverColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer`}
                            >
                                <div className={`${feature.iconColor} bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                    <Icon size={32} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-800 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Knowledge