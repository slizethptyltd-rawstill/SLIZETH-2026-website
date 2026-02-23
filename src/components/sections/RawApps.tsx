import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Monitor, Database, Lock, Zap, Code, Globe } from 'lucide-react';
import { RawAppsLogo } from '@/components/ui/Logo';

const features = [
  {
    title: "Small Business Visibility",
    description: "Websites specifically tailored to your business needs, ensuring your clients can easily find and connect with you online.",
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: "Web Applications",
    description: "Scalable, secure, and high-performance web platforms built with modern frameworks.",
    icon: <Monitor className="w-6 h-6" />
  },
  {
    title: "Mobile Development",
    description: "Native and cross-platform mobile apps that deliver exceptional user experiences.",
    icon: <Smartphone className="w-6 h-6" />
  },
  {
    title: "Custom Platforms",
    description: "Bespoke business logic and workflow automation solutions for enterprise needs.",
    icon: <Database className="w-6 h-6" />
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade security protocols implemented in every layer of development.",
    icon: <Lock className="w-6 h-6" />
  },
  {
    title: "High Performance",
    description: "Optimized code and infrastructure ensuring lightning-fast load times.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: "Clean Architecture",
    description: "Maintainable, documented, and scalable codebases built for the future.",
    icon: <Code className="w-6 h-6" />
  }
];

export default function RawApps() {
  return (
    <section id="raw-apps" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-4 bg-slate-800/50 rounded-2xl mb-6 backdrop-blur-sm border border-slate-700"
          >
            <RawAppsLogo className="w-12 h-12 mr-4" light={true} />
            <div className="text-left">
              <h2 className="text-2xl font-display font-bold text-white leading-none">Raw Apps</h2>
              <span className="text-slate-400 text-sm uppercase tracking-wider">Division of SLIZETH PTY (LTD)</span>
            </div>
          </motion.div>
          
          <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Digital Engineering <br/>
            <span className="text-teal-400">Tailored for Your Business.</span>
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Raw Apps is dedicated to supporting small businesses by providing custom-tailored websites that ensure online visibility. We don't just build apps; we create digital pathways for your clients to find you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-teal-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform border border-slate-700">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
