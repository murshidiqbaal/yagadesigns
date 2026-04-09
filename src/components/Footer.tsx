import logo from '@/assets/logo.jpeg';

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 grain-overlay">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="LuxeVibes" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-heading text-xl tracking-wider">
              LUXE<span className="text-primary">VIBES</span>
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} LuxeVibes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
