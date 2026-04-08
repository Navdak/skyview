import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Star, Info, ShoppingCart, Plus, Minus, X, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Cocktails', 'Wine'];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'menuItems'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setItems(menuData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      alert('Please login to place an order');
      return;
    }

    setIsOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'Guest',
        customerEmail: auth.currentUser.email,
        items: cart,
        totalAmount,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setCart([]);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setIsCartOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Header */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070" 
            alt="Menu Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-neutral-950/50 to-neutral-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tighter">Our <span className="text-amber-500 italic">Menu</span></h1>
            <p className="text-neutral-400 max-w-xl mx-auto font-light tracking-widest uppercase text-xs">
              A curated selection of the finest flavors from around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-20 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex justify-center items-center space-x-4 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                    : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img 
                      src={item.imageUrl || `https://picsum.photos/seed/${item.name}/800/600`} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60"></div>
                    {item.isPopular && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center space-x-1">
                        <Star size={10} fill="currentColor" />
                        <span>Popular</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-6">
                      <span className="text-amber-500 text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="text-xl font-serif font-bold group-hover:text-amber-500 transition-colors break-words overflow-hidden">{item.name}</h3>
                      <span className="text-amber-500 font-bold font-mono shrink-0">₦{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6 line-clamp-3 overflow-hidden break-words">
                      {item.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Plus size={14} />
                        <span>Add to Cart</span>
                      </button>
                      {!item.isAvailable && (
                        <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Sold Out</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Utensils size={48} className="mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 uppercase tracking-widest text-sm">No items found in this category</p>
          </div>
        )}
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-900 z-[70] shadow-2xl border-l border-white/10 flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="text-amber-500" />
                  <h2 className="text-xl font-serif font-bold">Your Order</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart size={48} className="mx-auto text-neutral-800 mb-4" />
                    <p className="text-neutral-500 uppercase tracking-widest text-xs">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex-grow pr-4 overflow-hidden">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        <p className="text-amber-500 text-xs font-mono">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-3 bg-neutral-800 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-amber-500 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-amber-500 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="ml-4 text-neutral-600 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-white/5 bg-black/20">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-neutral-500 uppercase tracking-widest text-xs font-bold">Total Amount</span>
                    <span className="text-2xl font-serif font-bold text-amber-500">₦{totalAmount.toLocaleString()}</span>
                  </div>
                  
                  {orderSuccess ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center space-x-3 text-green-500 text-sm mb-4">
                      <CheckCircle2 size={18} />
                      <span>Order placed successfully!</span>
                    </div>
                  ) : (
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isOrdering}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center space-x-2"
                    >
                      {isOrdering ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Place Order</span>
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-[10px] text-neutral-600 text-center mt-4 uppercase tracking-widest">
                    Payment will be collected at the restaurant
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Toggle Button */}
      {cart.length > 0 && !isCartOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-amber-600 text-white p-4 rounded-full shadow-2xl shadow-amber-600/40 flex items-center space-x-2"
        >
          <ShoppingCart size={24} />
          <span className="bg-white text-amber-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {cart.reduce((acc, i) => acc + i.quantity, 0)}
          </span>
        </motion.button>
      )}
      {/* Info Section */}
      <section className="max-w-4xl mx-auto px-4 mt-24">
        <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-12 text-center">
          <h2 className="text-2xl font-serif font-bold mb-6">Dietary Requirements?</h2>
          <p className="text-neutral-400 mb-8 font-light">
            Our kitchen is happy to accommodate any allergies or dietary preferences. Please inform your server when ordering.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-neutral-500 uppercase tracking-widest text-[10px] font-bold">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Vegetarian</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Gluten Free</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Spicy</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
