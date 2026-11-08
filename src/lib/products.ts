import { categoriesData, slugifyCategory } from "@/lib/categories";

const categoryImages: Record<string, string> = {
  "Visiting Cards": "https://m.media-amazon.com/images/I/51AAkq0aAHL._AC_UF1000,1000_QL80_.jpg",
  "Stationery, Letterheads & Notebooks": "/letterhead.png",
  "Stamps and Ink": "https://printo-s3.dietpixels.net/Soldout/Stamps/Self-ink-Rubber-Stamps_1775464218.jpg",
  "Signs, Posters & Marketing Materials": "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&q=80",
  "Labels, Stickers & Packaging": "/sticker.png",
  "Clothing, Caps & Bags": "/caps.png",
  "Mugs, Albums & Gifts": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
  "Umbrellas & Rainwear": "https://images.unsplash.com/photo-1511497584788-876760111969?w=500&q=80",
  "Drinkware": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
  "Custom Polo T-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  "Custom T-Shirts": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
};

export const categoriesList = categoriesData.map((category) => ({
  name: category.name,
  slug: slugifyCategory(category.name),
  image: categoryImages[category.name] ?? "/file.svg",
}));

export const popularProducts = [
  { name: "Standard Visiting Cards", badge: "", image: "/vistingcard1.png", price: 200, unit: "100 units" },
  { name: "Rounded Corner Visiting Cards", badge: "BUY 100 @ Rs. 250", image: "/vistingcard2.png", price: 250, unit: "100 units" },
  { name: "Letterheads", badge: "BUY 10 @ Rs. 230", image: "/letterhead.png", price: 230, unit: "10 units" },
  { name: "Photo Albums", badge: "BUY 1 @ Rs. 715", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80", price: 715, unit: "1 unit" },
  { name: "Stickers", badge: "BUY 10 @ Rs. 150", image: "/sticker.png", price: 150, unit: "10 units" },
  { name: "Men's Polo T-Shirts", badge: "BUY 1 @ Rs. 570", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80", price: 570, unit: "1 unit" },
];

export const trendingProducts = [
  { name: "Classic Visiting Cards", badge: "BUY 100 @ Rs. 230", image: "/vistingcard1.png", price: 230, unit: "100 units" },
  { name: "Spot UV Visiting Cards", badge: "BUY 100 @ Rs. 580", image: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=500&q=80", price: 580, unit: "100 units" },
  { name: "Printed Caps", badge: "BUY 1 @ Rs. 310", image: "https://images.unsplash.com/photo-1521369909029-14af6784d59a?w=500&q=80", price: 310, unit: "1 unit" },
  { name: "Premium Polo T-Shirts", badge: "BUY 1 @ Rs. 770", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80", price: 770, unit: "1 unit" },
  { name: "Printed Polos - Multi Location", badge: "BUY 1 @ Rs. 570", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", price: 570, unit: "1 unit" },
  { name: "Women's Polo T-shirts", badge: "BUY 1 @ Rs. 570", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?w=500&q=80", price: 570, unit: "1 unit" },
];

export const allProducts = [...popularProducts, ...trendingProducts];

export function getProductBySlug(slug: string) {
  const product = allProducts.find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  if (product) return product;

  // Fallback for missing products
  return {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&q=80',
    price: 499,
    unit: '1 unit',
    badge: ''
  };
}
