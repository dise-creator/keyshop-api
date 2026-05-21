const BASE = "http://213.176.66.225:3000/api";

export async function getPlatforms() {
  const res = await fetch(`${BASE}/platforms`);
  return res.json();
}

export async function getAllProducts() {
  const res = await fetch(`${BASE}/products`);
  return res.json();
}