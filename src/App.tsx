import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { UserProfile } from './types';
import { LogIn, LogOut, Menu as MenuIcon, X, User, Calendar, LayoutDashboard, Star, MapPin, Phone, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          // Create new user profile
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: firebaseUser.email === 'navdak86@gmail.com' ? 'admin' : 'customer',
            createdAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
          setUser(newProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-serif font-bold tracking-tighter text-amber-500">SKY VIEW</span>
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mt-1">ABUJA</span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm uppercase tracking-widest hover:text-amber-500 transition-colors">Home</Link>
                <Link to="/menu" className="text-sm uppercase tracking-widest hover:text-amber-500 transition-colors">Menu</Link>
                <Link to="/reservations" className="text-sm uppercase tracking-widest hover:text-amber-500 transition-colors">Reservations</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1 text-sm uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/20">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:text-amber-500 transition-colors" title="Logout">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <button onClick={handleLogin} className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full transition-all text-sm font-medium uppercase tracking-widest">
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-neutral-100 p-2">
                  {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden bg-neutral-900 border-b border-white/10 px-4 py-8 space-y-6"
              >
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg uppercase tracking-widest text-center">Home</Link>
                <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="block text-lg uppercase tracking-widest text-center">Menu</Link>
                <Link to="/reservations" onClick={() => setIsMenuOpen(false)} className="block text-lg uppercase tracking-widest text-center">Reservations</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-lg uppercase tracking-widest text-amber-500 text-center">Dashboard</Link>
                )}
                <div className="flex justify-center pt-4">
                  {user ? (
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-2 text-neutral-400">
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <button onClick={() => { handleLogin(); setIsMenuOpen(false); }} className="bg-amber-600 text-white px-8 py-3 rounded-full uppercase tracking-widest text-sm font-bold">
                      Login
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservations" element={<Reservations user={user} onLogin={handleLogin} />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <span className="text-3xl font-serif font-bold tracking-tighter text-amber-500">SKY VIEW</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 mt-2">ABUJA</span>
                </Link>
                <p className="text-neutral-400 max-w-md leading-relaxed">
                  Experience the pinnacle of fine dining in the heart of Abuja. Our rooftop venue offers breathtaking views, exquisite cocktails, and a menu crafted by world-class chefs.
                </p>
              </div>
              
              <div>
                <h4 className="text-amber-500 uppercase tracking-widest text-sm font-bold mb-6">Contact</h4>
                <ul className="space-y-4 text-neutral-400">
                  <li className="flex items-start space-x-3">
                    <MapPin size={18} className="text-amber-500 shrink-0 mt-1" />
                    <span>123 Rooftop Plaza, Central Business District, Abuja, Nigeria</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone size={18} className="text-amber-500" />
                    <span>+234 800 SKY VIEW</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Clock size={18} className="text-amber-500" />
                    <span>Open Daily: 12:00 PM - 2:00 AM</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-amber-500 uppercase tracking-widest text-sm font-bold mb-6">Follow Us</h4>
                <div className="flex space-x-4">
                  {/* Social Icons would go here */}
                  <span className="text-neutral-400 hover:text-amber-500 cursor-pointer transition-colors uppercase text-xs tracking-widest">Instagram</span>
                  <span className="text-neutral-400 hover:text-amber-500 cursor-pointer transition-colors uppercase text-xs tracking-widest">Twitter</span>
                  <span className="text-neutral-400 hover:text-amber-500 cursor-pointer transition-colors uppercase text-xs tracking-widest">Facebook</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 text-center text-neutral-600 text-xs uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} Sky View Abuja. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
