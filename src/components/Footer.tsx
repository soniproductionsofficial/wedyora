import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const linkClass =
  'text-[#3a2f32]/75 transition hover:text-[#8e1454]'

const headingClass =
  'text-[11px] font-medium uppercase tracking-[0.22em] text-[#8e1454]'

export function Footer() {
  return (
    <footer className="footer-brand">
      <div className="footer-brand-inner mx-auto grid max-w-7xl items-start gap-8 px-5 py-10 sm:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" className="inline-block" aria-label="Wedyora home">
            <Logo variant="circle" />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#3a2f32]/70">
            © {new Date().getFullYear()} Wedyora Photography. Capturing timeless milestones with elegance.
          </p>
        </div>
        <div>
          <p className={headingClass}>Legal</p>
          <ul className="mt-3 space-y-1.5 text-[12px] font-medium uppercase tracking-[0.14em]">
            <li>
              <Link to="/faq" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass}>
                Cookie Settings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className={headingClass}>Connect</p>
          <ul className="mt-3 space-y-1.5 text-[12px] font-medium uppercase tracking-[0.14em]">
            <li>
              <Link to="/faq" className={linkClass}>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass}>
                Contact Us
              </Link>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={linkClass}>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
