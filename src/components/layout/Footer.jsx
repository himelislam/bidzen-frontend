import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 text-slate-300">

      <div className="w-full px-6 lg:px-12 py-14">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-4">
              <span className="text-purple-400">Bid</span>Zen
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              A next-generation auction platform where buyers and sellers
              connect to trade smarter, faster, and more transparently.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-5">
              <a className="social-icon" href="#">FB</a>
              <a className="social-icon" href="#">IG</a>
              <a className="social-icon" href="#">X</a>
              <a className="social-icon" href="#">YT</a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <div className="footer-links">
              <Link to="/auctions">Explore Auctions</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/about">About Us</Link>
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="footer-title">Categories</h3>
            <div className="footer-links">
              <a href="#">Electronics</a>
              <a href="#">Vehicles</a>
              <a href="#">Fashion</a>
              <a href="#">Collectibles</a>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="footer-title">Support</h3>
            <div className="footer-links">
              <a href="#">Help Center</a>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact</a>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 my-10"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-medium">BidZen</span>.
            All rights reserved.
          </p>

          <p className="text-xs text-slate-600">
            Built with ❤️ for auction lovers
          </p>

        </div>

      </div>

      {/* STYLE */}
      <style>{`
        .footer-title {
          color: white;
          font-weight: 600;
          margin-bottom: 14px;
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
        }

        .footer-links a {
          color: #94a3b8;
          transition: 0.2s;
        }

        .footer-links a:hover {
          color: #a78bfa;
          transform: translateX(3px);
        }

        .social-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-size: 12px;
          color: #cbd5e1;
          transition: 0.2s;
        }

        .social-icon:hover {
          border-color: #a78bfa;
          color: #a78bfa;
          transform: translateY(-2px);
        }
      `}</style>

    </footer>
  );
}