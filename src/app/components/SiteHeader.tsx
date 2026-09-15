'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ModeToggle } from './ModeToggle';

const SITE_URL = 'https://bismarklanka.lk';
const LOGO_URL =
  'https://bismarklanka.lk/wp-content/uploads/2026/02/327553847_1145492842777495_5806176417345362493_n-1.jpg';

// Matches the live site's navigation item typography:
// "Roboto Flex", normal 400, 17px / 27px
const NAV_FONT = "font-['Roboto_Flex',sans-serif]";

const NAV_LINK_CLASSES = `px-3 py-2 text-[17px] leading-[27px] font-normal ${NAV_FONT} text-[#ED9420] dark:text-[#ED9420] hover:text-[#d67f12] dark:hover:text-[#d67f12] rounded-md transition-colors`;

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: `${SITE_URL}/` },
  { label: 'Services', href: `${SITE_URL}/services/` },
  {
    label: 'Projects',
    href: `${SITE_URL}/projects/`,
    children: [
      { label: 'Designs', href: `${SITE_URL}/designs/` },
      { label: 'Ongoing & Completed', href: `${SITE_URL}/ongoing-completed/` },
    ],
  },
  { label: 'Warranty', href: `${SITE_URL}/warranty/` },
  { label: 'Why Choose Us', href: `${SITE_URL}/why-choose-us/` },
  { label: 'About Us', href: `${SITE_URL}/about-us/` },
  { label: 'Contact', href: `${SITE_URL}/contact/` },
];

const QUOTE_URL = `${SITE_URL}/Get-Free-Quote`;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-clip border-b border-gray-200 dark:border-neutral-800 bg-[#F7FAFC] dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-[100px] items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <a href={`${SITE_URL}/`} className="flex items-center gap-3 shrink min-w-0">
            <img
              src={LOGO_URL}
              alt="Bismark Lanka Engineering"
              className="h-12 sm:h-14 w-auto max-w-32 sm:max-w-44 object-contain shrink-0"
            />
            <span className="flex flex-col leading-tight min-w-0">
              <span className={`truncate text-sm sm:text-base font-bold text-[#2D3748] dark:text-neutral-100 ${NAV_FONT}`}>
                Bismark Lanka Engineering
              </span>
              <span className={`hidden min-[420px]:block truncate text-xs text-[#2D3748]/70 dark:text-neutral-400 ${NAV_FONT}`}>
                Construction Company in Sri Lanka
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <a href={link.href} className={`flex items-center gap-1 ${NAV_LINK_CLASSES}`}>
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  </a>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-0 top-full pt-1 min-w-52">
                    <div className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-[#F7FAFC] dark:bg-neutral-900 shadow-lg p-1">
                      {link.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className={`block px-4 py-2 ${NAV_LINK_CLASSES} hover:bg-gray-200/60 dark:hover:bg-neutral-800`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a key={link.label} href={link.href} className={NAV_LINK_CLASSES}>
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              asChild
              className="hidden sm:inline-flex bg-[#ED9420] hover:bg-[#d67f12] text-white font-semibold"
            >
              <a href={QUOTE_URL}>Get Free Quote</a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-gray-200 dark:border-neutral-800 bg-[#F7FAFC] dark:bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 py-2">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="border-b border-gray-200/70 dark:border-neutral-800 last:border-0">
                  <div className="flex items-center">
                    <a
                      href={link.href}
                      className={`flex-1 px-2 py-3 text-[17px] leading-[27px] font-normal ${NAV_FONT} text-[#ED9420] dark:text-[#ED9420]`}
                    >
                      {link.label}
                    </a>
                    <button
                      type="button"
                      aria-label="Expand Projects submenu"
                      onClick={() => setMobileProjectsOpen((v) => !v)}
                      className="p-3 text-[#2D3748] dark:text-neutral-400"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${mobileProjectsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {mobileProjectsOpen && (
                    <div className="pb-2 pl-4">
                      {link.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className={`block px-2 py-2 text-[17px] leading-[27px] font-normal ${NAV_FONT} text-[#ED9420]/80 dark:text-[#ED9420]/80`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`block px-2 py-3 text-[17px] leading-[27px] font-normal ${NAV_FONT} text-[#ED9420] dark:text-[#ED9420] border-b border-gray-200/70 dark:border-neutral-800 last:border-0`}
                >
                  {link.label}
                </a>
              )
            )}
            <div className="py-3">
              <Button asChild className="w-full bg-[#ED9420] hover:bg-[#d67f12] text-white font-semibold">
                <a href={QUOTE_URL}>Get Free Quote</a>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
