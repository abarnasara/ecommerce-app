import React, { useState, useEffect } from "react";
import {auth, signOut} from "../firebase";

const API_URL = "http://localhost:5000";

export default function Dashboard({user}) {

  // =====State=====
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);


  // Fetch wishlist, cart, and order history from localStorage or API
    useEffect(() => {
      if (!user) return;

    // ====== User-specific keys ======
      const ordersKey = `orders_${user.uid}`;
      const cartKey = `cart_${user.uid}`;
      const wishlistKey = `wishlist_${user.uid}`;
      const addressesKey = `addresses_${user.uid}`;

      // Using localStorage
      const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const savedOrders = JSON.parse(localStorage.getItem(ordersKey)) || [];
      const savedAddresses = JSON.parse(localStorage.getItem(addressesKey)) || [];

      setAddresses(savedAddresses);
      setWishlist(savedWishlist);
      setCart(savedCart);
      setOrders(savedOrders);
    }, [user, refreshKey]);


    const handleMoveToCart = (product) => {
    if (!user) return alert("Please log in to continue.");
    if (product.stock === 0) {
      alert("This product is out of stock!");
      return;
    }

    const cartKey = `cart_${user.uid}`;
    const wishlistKey = `wishlist_${user.uid}`;

    const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartItemIndex = savedCart.findIndex((p) => p.id === product.id);

    if (cartItemIndex !== -1) {
      const existing = savedCart[cartItemIndex];
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
        savedCart[cartItemIndex] = existing;
      }
    } else {
      savedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(savedCart));
    setCart(savedCart);

    const updatedWishlist = wishlist.filter((p) => p.id !== product.id);
    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
setRefreshKey(prev => prev + 1);

    alert(`${product.name} moved to cart!`);
  };

  const handleRemoveFromWishlist = (productId) => {
  if (!user) return;
  const wishlistKey = `wishlist_${user.uid}`;
  const updatedWishlist = wishlist.filter((p) => p.id !== productId);
  setWishlist(updatedWishlist);
  setRefreshKey(prev => prev + 1);
  localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
};

const handleRemoveFromCart = (productId) => {
  if (!user) return;
  const cartKey = `cart_${user.uid}`;
  const updatedCart = cart.filter((p) => p.id !== productId);
  setCart(updatedCart);
  setRefreshKey(prev => prev + 1);

  localStorage.setItem(cartKey, JSON.stringify(updatedCart));
};

const handleConfirmOrder = () => {
  if (!user) return;
    const ordersKey = `orders_${user.uid}`;
    const cartKey = `cart_${user.uid}`;
    const addressesKey = `addresses_${user.uid}`;

  const deliveryAddress = selectedAddress || newAddress;
  if (!deliveryAddress) {
    alert("Please select or enter a delivery address!");
    return;
  }
  const newOrders = [
    ...orders,
    ...cart.map((item) => ({ ...item, address: deliveryAddress, status: "On Process", })),
  ];
  setOrders(newOrders);
  localStorage.setItem(ordersKey, JSON.stringify(newOrders));

  // Decrease Stock
  const allProducts = JSON.parse(localStorage.getItem("products")) || [];
  const updatedProducts = allProducts.map((p) => {
    const cartItem = cart.find((c) => c.id === p.id);
    if (cartItem) {
      return { ...p, stock: p.stock - cartItem.quantity };
    }
    return p;
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts));

  setCart([]);
  localStorage.setItem(cartKey, JSON.stringify([]));
  setRefreshKey(prev => prev + 1);

  alert(`Order confirmed! Delivery to: ${deliveryAddress}`);
};

const handleSaveAddress = () => {
    if (!user || !newAddress) return;
    const addressesKey = `addresses_${user.uid}`;
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    localStorage.setItem(addressesKey, JSON.stringify(updatedAddresses));
    setSelectedAddress(newAddress);
    setNewAddress("");
    setRefreshKey(prev => prev + 1);

    alert("Address saved!");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">User Dashboard</h1>

      {/* Wishlist Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
        {wishlist.length === 0 ? (
          <p>No products in wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>

                {/* Show button only if stock > 0 */}
                {product.stock > 0 && (
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="mt-2 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Move to Cart
                  </button>
                )}

                <button
      onClick={() => handleRemoveFromWishlist(product.id)}
      className="mt-2 ml-2 px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
    >
      Remove
    </button>

                {/* Optional: show message if out of stock */}
                {product.stock === 0 && (
                  <p className="mt-2 text-gray-500 italic">Out of stock</p>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Cart</h2>
        {cart.length === 0 ? (
          <p>No products in cart.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cart.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Stock: {product.stock}</p>

                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="mt-2 px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
  <h4 className="font-semibold mb-2">Select Delivery Address</h4>

  {/* Saved addresses dropdown */}
  {addresses.length > 0 && (
    <select
      className="border p-2 rounded w-full mb-2"
      value={selectedAddress}
      onChange={(e) => setSelectedAddress(e.target.value)}
    >
      <option value="">Select an address</option>
      {addresses.map((addr, index) => (
        <option key={index} value={addr}>
          {addr}
        </option>
      ))}
    </select>
  )}

  {/* Input for new address */}
  <input
    type="text"
    placeholder="Enter new address"
    value={newAddress}
    onChange={(e) => setNewAddress(e.target.value)}
    className="border p-2 rounded w-full mb-2"
  />
  <button
            onClick={handleSaveAddress}
            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Address
          </button>
  {/*
  <button
    onClick={() => {
      if (!newAddress) return;
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);
      localStorage.setItem(addressesKey, JSON.stringify(updatedAddresses));
      setSelectedAddress(newAddress);
      setNewAddress("");
      alert("Address saved!");
    }}
    className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
  >
    Save Address
  </button>*/}
</div>

        {cart.length > 0 && (

          <button
            onClick={handleConfirmOrder}
            className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Confirm Order
          </button>
        )}
      </div>

      {/* Order History Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p>No confirmed orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {orders.map((product, index) => (
              <div key={index} className="border p-4 rounded shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <p className="italic text-gray-600">Delivery: {product.address}</p>
                <p className="font-semibold">Status: {product.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
