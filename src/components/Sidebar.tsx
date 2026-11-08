"use client";
import Link from 'next/link';
import { useState } from 'react';
import { categoriesData, slugifyCategory } from '@/lib/categories';

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const hoveredData = categoriesData.find(c => c.name === activeCategory);

  return (
    <>
      <aside className="sidebar" onMouseLeave={() => setActiveCategory(null)}>
        <div className="sidebar-logo">
          <Link href="/">PixelToPieces</Link>
        </div>
        
        <div className="sidebar-section">
          <h4 className="sidebar-title">Categories</h4>
          <ul className="sidebar-list">
            {categoriesData.map((cat, idx) => (
              <li 
                key={idx} 
                className="sidebar-item" 
                onMouseEnter={() => setActiveCategory(cat.name)}
              >
                <Link href={`/category/${slugifyCategory(cat.name)}`} className={`sidebar-link ${activeCategory === cat.name ? 'active' : ''}`}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="sidebar-footer">
          <p>PixelToPieces v1.0.0</p>
          <p>Built with ❤️ by the open source community.</p>
        </div>
      </aside>

      {/* Mega Menu Panel */}
      {hoveredData && hoveredData.subCategories.length > 0 && (
        <div 
          className="mega-menu"
          onMouseEnter={() => setActiveCategory(hoveredData.name)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <div className="mega-menu-content">
            {hoveredData.subCategories.map((group, gIdx) => (
              <div key={gIdx} className="mega-menu-column">
                <h3 className="mega-menu-title">{group.title}</h3>
                <ul className="mega-menu-list">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx}>
                      <Link href={`/product/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="mega-menu-link">
                        {item.name}
                        {item.isNew && <span className="badge-new" style={{marginLeft: '0.5rem', marginBottom: 0, padding: '0.1rem 0.4rem', fontSize: '0.6rem'}}>NEW</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mega-menu-footer">
            <Link href={`/category/${slugifyCategory(hoveredData.name)}`} style={{fontWeight: 700, color: 'var(--primary-color)'}}>
              See All {hoveredData.name}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
