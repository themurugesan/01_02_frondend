import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardHeader from "../pages/header/cardHeader";
import "../pages/cart/CardPage.css";

export const Notify = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.token;
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : window.location.origin}/api/notify`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200 && response.data.cart) {
        setCart(response.data.cart);
      } else {
        console.error("Error: Cart data is missing or incorrect structure.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleProductClick = async (product) => {
    const token = localStorage.token;
    
    navigate("/dashboard", {
      state: { product }, 
    });
  
    try {
      const notifyClickResponse = await axios.post(`${process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : window.location.origin}/api/notifyremove`, { product }, {
        headers: { Authorization: token }
      });
  
    } catch (error) {
      console.error("Error removing product from notify:", error);
    }
  };

  return (
    <>
      <CardHeader />
      <div className="app-container">
        <h1 className="heading">Your Notify</h1>

        <div className="cart-items-container">
          {cart?.length > 0 ? (
            cart.map((item) => (
              <div
                key={item._id}
                className="cart-item"
                onClick={() => handleProductClick(item._id)} 
              >
                <h2>{item.title}</h2>
                <p>Price: ${item.amount}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))
          ) : (
            <p>Your notify is empty.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notify;
