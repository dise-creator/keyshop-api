const BASE = "http://213.176.66.225:3000/api";

export async function getPlatforms() {
  const res = await fetch(`${BASE}/platforms`);
  return res.json();
}

export async function getProducts(platformId?: string, regionId?: string) {
  const params = new URLSearchParams();
  if (platformId) params.append("platformId", platformId);
  if (regionId) params.append("regionId", regionId);
  const res = await fetch(`${BASE}/products?${params}`);
  return res.json();
}

export async function getPlatformBySlug(slug: string) {
  const res = await fetch(`${BASE}/platforms/${slug}`);
  return res.json();
}