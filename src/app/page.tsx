import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { categoriesList as categories, popularProducts, trendingProducts } from "@/lib/products";

export default function Home() {

  return (
    <main>


      <div className="container">
        {/* Hero Section */}
        <section className="hero-grid">
          <div className="hero-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1000&q=80')" }}>
            <div className="hero-content">
              <h3>Visiting Cards</h3>
              <p>100 Visiting Cards at Rs 200</p>
              <button className="btn btn-primary">Shop Now</button>
            </div>
          </div>
          
          <div className="hero-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525904097878-c0f1c69b4b49?w=1000&q=80')" }}>
            <div className="hero-content-alt">
              <h3>Look professional with custom rainwear</h3>
              <p>Starting at Rs. 655</p>
              <div className="btn-group">
                <button className="btn btn-primary">Umbrellas</button>
                <button className="btn btn-primary" style={{background: 'transparent', color: 'var(--primary-color)', border: '2px solid var(--primary-color)'}}>Raincoats</button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="section-title">Explore all categories</h2>
          <div className="categories-wrapper">
            <div className="categories-scroll">
              {categories.map((cat, idx) => (
                <Link href={`/category/${cat.slug}`} className="category-card" key={idx}>
                  <div className="category-img" style={{ backgroundImage: `url(${cat.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="category-title">{cat.name}</div>
                </Link>
              ))}
            </div>
            <button className="nav-arrow next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </section>

        {/* Popular Products */}
        <section>
          <h2 className="section-title">Our Most Popular Products</h2>
          <div className="products-grid">
            {popularProducts.map((prod, idx) => (
              <TiltCard href={`/product/${prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="product-card" key={idx}>
                <div className="product-img-wrapper">
                  <div className="product-badge">{prod.badge}</div>
                  <img src={prod.image} alt={prod.name} className="product-img" />
                </div>
                <div className="product-info">
                  <div className="product-title">{prod.name}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <h2 className="section-title">Trending</h2>
          <div className="products-grid">
            {trendingProducts.map((prod, idx) => (
              <TiltCard href={`/product/${prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="product-card" key={idx}>
                <div className="product-img-wrapper">
                  <div className="product-badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#0284c7' }}>{prod.badge}</div>
                  <img src={prod.image} alt={prod.name} className="product-img" />
                </div>
                <div className="product-info">
                  <div className="product-title">{prod.name}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
