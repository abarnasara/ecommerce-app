export const API_URL = "http://localhost:5000";

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}
