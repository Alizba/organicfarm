"use client"

import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState(() => {

        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...product, quantity: 1 }]
        });
    }

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => useContext(CartContext)
