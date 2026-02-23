import React from 'react';
import { SliZethLogo } from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <SliZethLogo className="w-8 h-8" light={true} />
              <span className="font-display font-bold text-xl text-white">SLIZETH PTY (LTD)</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              A multi-departmental ecosystem built for scale. Empowering businesses through Raw Apps and future ventures.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Divisions</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#raw-apps" className="hover:text-teal-400 transition-colors">Raw Apps</a></li>
              <li><span className="opacity-50 cursor-not-allowed">Future Ventures</span></li>
              <li><span className="opacity-50 cursor-not-allowed">Consulting</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-teal-400 transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} SLIZETH PTY (LTD). All rights reserved.</p>
            <span className="hidden md:inline text-slate-700">|</span>
            <p className="text-slate-500">CIPC Registered Entity</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            System Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
