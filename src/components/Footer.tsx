import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4 className="footer-heading">PixelToPieces</h4>
          <p className="footer-text">
            Your premium destination for custom printing and merchandising. We bring your pixels to life with high-quality physical products.
          </p>
          <div className="social-links">
            <Link href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Link>
            <Link href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </Link>
            <Link href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
          </div>
        </div>
        
        <div className="footer-column">
          <h4 className="footer-heading">Products</h4>
          <ul className="footer-list">
            <li><Link href="/category/visiting-cards">Visiting Cards</Link></li>
            <li><Link href="/category/custom-polo-t-shirts">Corporate Apparel</Link></li>
            <li><Link href="/category/signs-posters-marketing-materials">Marketing Materials</Link></li>
            <li><Link href="/category/mugs-albums-gifts">Photo Gifts</Link></li>
            <li><Link href="/category/labels-stickers-packaging">Packaging</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-list">
            <li><Link href="#">Help Center</Link></li>
            <li><Link href="#">Track Order</Link></li>
            <li><Link href="#">Return Policy</Link></li>
            <li><Link href="#">Shipping Info</Link></li>
            <li><Link href="#">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-column" style={{flex: 1.5}}>
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-text">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered straight to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" className="form-input" style={{width: '100%', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)'}} />
            <button className="btn btn-primary" style={{width: '100%'}}>Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PixelToPieces Open Source Project. All rights reserved.</p>
        <div className="footer-legal">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
