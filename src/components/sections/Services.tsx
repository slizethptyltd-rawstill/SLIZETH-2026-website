import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const services = [
  'Web Application Development',
  'Mobile Application Development',
  'Custom Platform Development',
  'UI/UX Design & Prototyping',
  'Enterprise Security Solutions',
  'Cloud Infrastructure & DevOps',
  'AI & Machine Learning Integration',
  'Ongoing Support & Maintenance',
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
            A Comprehensive Suite of Digital Solutions
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From initial concept to final deployment, Raw Apps provides end-to-end development services to bring your vision to life.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-1 bg-teal-500/20 text-teal-600 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-slate-700 font-medium">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
