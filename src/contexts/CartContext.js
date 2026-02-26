"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [orderSuccess, setOrderSuccess]   = useState(null);  // first orderId (backwards compat)
  const [orderIds, setOrderIds]           = useState([]);     // ✅ all order IDs (split orders)
  const [orderCount, setOrderCount]       = useState(0);      // ✅ how many shops order was split into

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = async (checkoutData) => {
    const DELIVERY_FEE = cartTotal >= 2000 ? 0 : 150;

    const payload = {
      ...checkoutData,
      items: cart.map((item) => ({
        productId: item.id,      
        name:      item.name,
        price:     item.price,
        quantity:  item.quantity,
        image:     item.image || "",
      })),
      subtotal:    cartTotal,
      deliveryFee: DELIVERY_FEE,
      total:       cartTotal + DELIVERY_FEE,
    };

    const { data } = await axios.post("/api/checkout", payload);

    clearCart();

    setOrderSuccess(data.orderId);              
    setOrderIds(data.orderIds || [data.orderId]);
    setOrderCount(data.orderCount || 1);

    return data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        orderSuccess,
        orderIds,      
        orderCount,   
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);