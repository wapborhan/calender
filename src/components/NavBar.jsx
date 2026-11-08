import { useState } from "react";
import {
  Menu,
  X,
  CalendarDays,
  ExternalLink,
  FolderGit2,
  Sparkles,
} from "lucide-react";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white shadow-lg shadow-purple-900/10 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="group flex items-center gap-2.5 transition-all duration-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner transition-transform duration-200 group-hover:scale-105 group-hover:bg-white/25">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SR Calender
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-purple-100 backdrop-blur-xs border border-white/20">
                  <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                  Live
                </span>
              </span>
              <span className="text-[11px] font-medium text-purple-200 tracking-wide">
                Schedule & Events
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://code.wapborhan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:shadow-md hover:ring-white/40 active:scale-95"
          >
            <FolderGit2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 text-purple-200" />
            <span>Project</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-white transition-all duration-200 hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={() => setNavbar(!navbar)}
            aria-expanded={navbar}
            aria-label="Toggle navigation menu"
          >
            {navbar ? (
              <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {navbar && (
        <div className="md:hidden border-t border-white/10 bg-purple-800/95 backdrop-blur-xl px-4 pt-3 pb-5 transition-all duration-300">
          <div className="space-y-2">
            <a
              href="https://code.wapborhan.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setNavbar(false)}
              className="flex items-center justify-between rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-white/25 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="h-5 w-5 text-purple-200" />
                <span>Visit Projects</span>
              </div>
              <ExternalLink className="h-4 w-4 opacity-80" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
