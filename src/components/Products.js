import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

const API_URL = "http://localhost:5000";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(""); // "asc" or "desc"

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        // Initialize localStorage for stock if not already present
      if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify(data));
      }
      const storedProducts = JSON.parse(localStorage.getItem("products"));
      setProducts(storedProducts);
    })
      .catch((err) => console.error(err));
  }, []);

  // Filter products by search
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "asc") return a.price - b.price;
      if (sort === "desc") return b.price - a.price;
      return 0;
    });

const [quantities, setQuantities] = useState({}); // { productId: qty }

const handleQuantityChange = (productId, value, stock) => {
  let qty = Math.min(Math.max(1, value), stock); // keep between 1 and stock
  setQuantities((prev) => ({ ...prev, [productId]: qty }));
};


    //Add to Cart
  const handleAddToCart = (product) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to add items to cart.");
    return;
  }

  if (product.stock === 0) return;

  const qty = quantities[product.id] || 1;
  const cartKey = `cart_${user.uid}`;

  const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
  //const updatedCart = [...savedCart, { ...product, quantity: qty }];
  //localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  const existingIndex = savedCart.findIndex((p) => p.id === product.id);

  if (existingIndex !== -1) {
    savedCart[existingIndex].quantity += qty;
  } else {
    savedCart.push({ ...product, quantity: qty });
  }

  //Save updated cart back to localStorage
  localStorage.setItem(cartKey, JSON.stringify(savedCart));
  alert(`Added ${qty} x ${product.name} to cart`);
  };

  //Wishlist
  const handleAddToWishlist = (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add to wishlist.");
      return;
    }
    if (product.stock === 0) return;
  const wishlistKey = `wishlist_${user.uid}`;
  const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
  // prevent duplicates
  if (savedWishlist.some((p) => p.id === product.id)) {
    alert("Already in wishlist.");
    return;
  }
  const updatedWishlist = [...savedWishlist, product];
  localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    alert(`Added ${product.name} to wishlist`);
  };

  return (
    <div className="p-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2 mb-2 sm:mb-0"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>

              <div className="mt-2 flex items-center space-x-2">
                <label>Qty:</label>
                <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                    handleQuantityChange(product.id, parseInt(e.target.value), product.stock)
                    }
                    className="border p-1 w-16 rounded"
                />
                </div>

            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className={`mt-2 px-3 py-1 rounded ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleAddToWishlist(product)}
              disabled={product.stock === 0}
              className={`mt-2 ml-2 px-3 py-1 rounded ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              }`}
            >
              Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
