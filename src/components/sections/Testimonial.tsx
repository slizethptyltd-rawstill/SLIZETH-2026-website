import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

export default function Testimonial() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Quote className="w-32 h-32 text-slate-900" />
            </div>
            
            <div className="relative z-10">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl font-display font-medium text-slate-900 leading-relaxed mb-8">
                "As a small business owner, I struggled to get noticed online. Raw Apps didn't just build a website; they built a platform tailored exactly to my needs. Now, my clients find me easily, and my business has grown significantly."
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/business/200/200" 
                    alt="Business Owner" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Sarah Jenkins</div>
                  <div className="text-sm text-slate-500">Owner, Jenkins Consulting</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
