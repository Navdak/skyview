import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Utensils, Wine, Music, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
            alt="Sky View Rooftop" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-neutral-950"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 border border-amber-500/30 rounded-full text-amber-500 text-xs uppercase tracking-[0.4em] mb-6">
              Elevated Dining Experience
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter mb-8 leading-none">
              Dine Above <br />
              <span className="text-amber-500">The Clouds</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Experience Abuja's most exclusive rooftop destination. Fine dining, signature cocktails, and panoramic city views await.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/reservations" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all transform hover:scale-105">
                Book a Table
              </Link>
              <Link to="/menu" className="w-full sm:w-auto border border-white/20 hover:border-amber-500 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all">
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500"
        >
          <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent mx-auto"></div>
        </motion.div>
      </section>

      {/* Features / Highlights */}
      <section className="py-24 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-amber-500/30 transition-colors"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Exquisite Cuisine</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Our world-class chefs prepare a fusion of local and international flavors using the finest ingredients.
              </p>
            </motion.div>

            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-amber-500/30 transition-colors"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Wine size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Signature Cocktails</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Expert mixologists crafting unique blends that perfectly complement our stunning rooftop atmosphere.
              </p>
            </motion.div>

            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-amber-500/30 transition-colors"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Music size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Vibrant Atmosphere</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                From romantic dinners to lively group celebrations, we provide the perfect backdrop for every moment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                viewport={{ once: true }}
              >
                <span className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                  Abuja's Premier <br />
                  <span className="text-amber-500 italic">Rooftop Destination</span>
                </h2>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Sky View Abuja is more than just a restaurant; it's a celebration of life, luxury, and the vibrant spirit of Nigeria's capital. Located atop the city's most prestigious plaza, we offer an unparalleled 360-degree view of the skyline.
                </p>
                <p className="text-neutral-400 mb-8 leading-relaxed">
                  Whether you're here for our famous Sunday Brunch, a business lunch, or a romantic dinner under the stars, our commitment to excellence ensures every visit is unforgettable.
                </p>
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <div className="text-3xl font-serif font-bold text-amber-500 mb-1">5★</div>
                    <div className="text-xs uppercase tracking-widest text-neutral-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-amber-500 mb-1">100+</div>
                    <div className="text-xs uppercase tracking-widest text-neutral-500">Wine List</div>
                  </div>
                </div>
                <Link to="/reservations" className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-sm group">
                  <span>Book Your Experience</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974" 
                  alt="Restaurant Interior" 
                  className="w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Ready for an Unforgettable Night?</h2>
          <p className="text-amber-100 text-lg mb-12 max-w-2xl mx-auto">
            Join us at Sky View Abuja and experience the best of Nigerian hospitality combined with international luxury.
          </p>
          <Link to="/reservations" className="bg-white text-amber-600 hover:bg-neutral-100 px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest transition-all shadow-xl">
            Make a Reservation
          </Link>
        </div>
      </section>
    </div>
  );
}
