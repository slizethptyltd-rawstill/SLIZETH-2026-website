/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import RawApps from '@/components/sections/RawApps';
import Services from '@/components/sections/Services';
import Testimonial from '@/components/sections/Testimonial';

import Tools from '@/components/sections/Tools';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chatbot/Chatbot';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/30">
      <Navbar />
      <main>
        <Hero />
        <About />
        <RawApps />
        <Services />
        <Testimonial />

        <Tools />
        <Contact />
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}
