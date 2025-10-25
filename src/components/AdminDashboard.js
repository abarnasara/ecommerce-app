import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [allOrders, setAllOrders] = useState([]);

  // Load all orders from every user
  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const userOrders = [];

    allKeys.forEach((key) => {
      if (key.startsWith("orders_")) {
        const orders = JSON.parse(localStorage.getItem(key)) || [];
        const userId = key.split("_")[1];
        orders.forEach((order) => {
          userOrders.push({ ...order, userId,userName: order.userName || "Unknown User", storageKey: key });
        });
      }
    });

    setAllOrders(userOrders);
  }, []);

  // Change status and update in localStorage
  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...allOrders];
    const targetOrder = updatedOrders[index];
    targetOrder.status = newStatus;

    // Update localStorage for that specific user
    const userOrdersKey = targetOrder.storageKey;
    const existingOrders =
      JSON.parse(localStorage.getItem(userOrdersKey)) || [];

    const updatedUserOrders = existingOrders.map((o) =>
      o.name === targetOrder.name &&
      o.address === targetOrder.address &&
      o.quantity === targetOrder.quantity
        ? { ...o, status: newStatus }
        : o
    );

    localStorage.setItem(userOrdersKey, JSON.stringify(updatedUserOrders));
    setAllOrders(updatedOrders);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {allOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order, index) => (
            <div
              key={index}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{order.name}</h4>
                <p>Quantity: {order.quantity}</p>
                <p>Address: {order.address}</p>
                <p>User ID: {order.userId}</p>
                <p>User Name: <strong>{order.userName}</strong></p>
                <p>
                  Status:{" "}
                  <span className="font-bold text-blue-600">{order.status}</span>
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="On Process">On Process</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
