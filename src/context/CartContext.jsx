import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load from local storage if available
        const savedCart = localStorage.getItem('envision_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save to local storage whenever cart changes
        localStorage.setItem('envision_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (event) => {
        setCart((prevCart) => {
            // Check if event is already in cart
            if (prevCart.some((item) => item.id === event.id)) {
                // Optionally show a toast/alert or just ignore
                // console.log('Event already in cart'); 
                return prevCart;
            }
            return [...prevCart, event];
        });
    };

    const removeFromCart = (eventId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== eventId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
