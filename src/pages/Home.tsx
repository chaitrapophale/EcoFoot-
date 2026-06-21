import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Wind, Droplets, Sun, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  })
};

const features = [
  { icon: Leaf, title: 'Living Footprint', desc: 'Watch your daily footprint transform from polluted land into a thriving miniature forest as you complete sustainable actions.', color: 'emerald' },
  { icon: TreePine, title: 'Forest Trail', desc: 'Build a winding forest path one restored day at a time. Each completed day grows into a blooming miniature ecosystem.', color: 'green' },
  { icon: Wind, title: 'AI Eco Journey', desc: 'Let AI craft a personalized daily sustainability plan based on your lifestyle, habits, and environmental goals.', color: 'teal' },
  { icon: Droplets, title: 'Wellness Tracking', desc: 'Track hydration, steps, outdoor time and cycling. Your health and the planet\'s health grow together.', color: 'sky' },
  { icon: Sun, title: 'Achievements', desc: 'Unlock nature-themed badges as you reach milestones. From Seedling to Planet Champion, every step matters.', color: 'amber' },
];

export const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
        {/* Floating glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-[100px] animate-pulse-slow pointer-events-none" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Your sustainability journey starts here
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-6xl md:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'Lora, Georgia, serif' }}
        >
          <span className="text-gradient-emerald">Eco</span>
          <span className="text-white">Foot</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          An immersive sustainability experience where every small action heals the earth beneath your feet.
          Watch nature come alive as you restore your living footprint — one habit at a time.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/choose-journey">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(16,185,129,0.25)' }}
              whileTap={{ scale: 0.97 }}
              id="hero-start-btn"
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/auth">
            <button id="hero-signin-btn" className="flex items-center gap-2 px-8 py-4 glass-panel glass-card-hover text-slate-300 font-medium rounded-2xl">
              Sign In / Sign Up
            </button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">What is EcoFoot?</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Lora, serif' }}>
            Sustainability, <span className="text-gradient-emerald">Reimagined</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto">
            EcoFoot isn't a carbon calculator. It's a living world. Each sustainable action you take
            is a restoration — a healing of the earth beneath your feet. Watch as smoke clears, flowers
            bloom, trees grow, and birds return as you build greener daily habits.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel glass-card-hover rounded-2xl p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/15 border border-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center glass-panel rounded-3xl p-12 border border-emerald-500/15"
        >
          <div className="text-5xl mb-6">🌱</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
            Ready to restore your footprint?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of eco-warriors building a greener tomorrow — one restored day at a time.
          </p>
          <Link to="/choose-journey">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              id="cta-start-journey-btn"
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Start Your Journey Today
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
