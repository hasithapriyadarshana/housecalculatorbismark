import { Facebook, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const SITE_URL = 'https://bismarklanka.lk';
const LOGO_URL =
  'https://bismarklanka.lk/wp-content/uploads/2026/02/327553847_1145492842777495_5806176417345362493_n-1.jpg';

const QUICK_LINKS = [
  { label: 'Home', href: `${SITE_URL}/` },
  { label: 'Services', href: `${SITE_URL}/services/` },
  { label: 'Projects', href: `${SITE_URL}/projects/` },
  { label: 'Warranty', href: `${SITE_URL}/warranty/` },
  { label: 'Why Choose Us', href: `${SITE_URL}/why-choose-us/` },
  { label: 'About Us', href: `${SITE_URL}/about-us/` },
  { label: 'Contact', href: `${SITE_URL}/contact/` },
  { label: 'Get Free Quote', href: `${SITE_URL}/Get-Free-Quote` },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-neutral-800 bg-[#F7FAFC] dark:bg-neutral-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <a href={`${SITE_URL}/`} className="flex items-center gap-3">
              <img
                src={LOGO_URL}
                alt="Bismark Lanka Engineering"
                className="h-14 w-auto max-w-44 object-contain"
              />
            </a>
            <p className="mt-4 text-sm leading-6 text-[#2D3748]/80 dark:text-neutral-400">
              Bismark Lanka Engineering provides quality construction services with
              customized designs, backed by over 18 years of experience.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="https://facebook.com/bismarkengineering/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-neutral-800 text-[#2D3748] dark:text-neutral-300 hover:text-[#ED9420] hover:border-[#ED9420] transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/bismark-lanka-engineering"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-neutral-800 text-[#2D3748] dark:text-neutral-300 hover:text-[#ED9420] hover:border-[#ED9420] transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-base font-bold text-[#2D3748] dark:text-neutral-100 mb-4">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#2D3748]/80 dark:text-neutral-400 hover:text-[#ED9420] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold text-[#2D3748] dark:text-neutral-100 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-[#2D3748]/80 dark:text-neutral-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#ED9420]" />
                Katubedda, Moratuwa, Colombo
              </li>
              <li>
                <a
                  href="tel:+94777793790"
                  className="flex items-center gap-2 text-[#2D3748]/80 dark:text-neutral-400 hover:text-[#ED9420] transition-colors"
                >
                  <Phone size={16} className="shrink-0 text-[#ED9420]" />
                  +94 77 779 3790
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@bismarklanka.lk"
                  className="flex items-center gap-2 text-[#2D3748]/80 dark:text-neutral-400 hover:text-[#ED9420] transition-colors"
                >
                  <Mail size={16} className="shrink-0 text-[#ED9420]" />
                  info@bismarklanka.lk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-neutral-800 pt-6 text-center">
          <p className="text-sm text-[#2D3748]/70 dark:text-neutral-500">
            © {new Date().getFullYear()} Bismark Lanka Engineering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
