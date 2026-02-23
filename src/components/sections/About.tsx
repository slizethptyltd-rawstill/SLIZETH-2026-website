import React from 'react';
import { motion } from 'motion/react';
import { Layers, TrendingUp, ShieldCheck, Globe } from 'lucide-react';

const divisions = [
  {
    title: "Raw Apps",
    description: "Our premier digital development division specializing in high-performance web and mobile applications.",
    icon: <Layers className="w-6 h-6" />,
    active: true
  },
  {
    title: "Future Ventures",
    description: "Expanding into AI research, sustainable energy, and automated logistics solutions.",
    icon: <TrendingUp className="w-6 h-6" />,
    active: false
  },
  {
    title: "Consulting",
    description: "Strategic digital transformation consulting for enterprise-level organizations.",
    icon: <Globe className="w-6 h-6" />,
    active: false
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">About SLIZETH PTY (LTD)</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
              Built for Scale. <br/>Engineered for Excellence.
            </h3>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              SLIZETH PTY (LTD) is not just a software house; we are a multi-dimensional ecosystem designed to scale across industries. 
              Our foundation is built on technical precision and strategic foresight.
            </p>
            
            <div className="bg-teal-50 border border-teal-100 p-6 rounded-xl mb-8">
              <h4 className="text-teal-800 font-bold mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Empowering Small Business
              </h4>
              <p className="text-teal-700/80 text-sm leading-relaxed">
                Through our <strong>Raw Apps</strong> division, we are responsible for supporting small businesses to be visible online. We provide websites tailored for your specific business needs, ensuring your clients can find you easily.
              </p>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
              While our current focus is driven by our Raw Apps division, our infrastructure is ready to support new ventures in emerging technologies.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-3xl font-bold text-slate-900 mb-1">3+</div>
                <div className="text-sm text-slate-500">Divisions Planned</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                <div className="text-sm text-slate-500">Scalable Architecture</div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6" id="divisions">
            {divisions.map((division, index) => (
              <motion.div
                key={division.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  division.active 
                    ? 'bg-slate-900 border-slate-800 shadow-xl' 
                    : 'bg-white border-slate-200 hover:border-teal-200 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    division.active ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {division.icon}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold mb-2 ${
                      division.active ? 'text-white' : 'text-slate-900'
                    }`}>
                      {division.title}
                      {division.active && <span className="ml-3 text-xs bg-teal-500 text-slate-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Active</span>}
                    </h4>
                    <p className={`${
                      division.active ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {division.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
