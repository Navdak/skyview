import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MenuItem, Reservation, UserProfile, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  ShoppingBag,
  PackageCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'menu' | 'users' | 'reviews' | 'orders'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Menu Form State
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    imageUrl: '',
    isAvailable: true,
    isPopular: false
  });

  useEffect(() => {
    const resUnsubscribe = onSnapshot(query(collection(db, 'reservations'), orderBy('createdAt', 'desc')), (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
    });

    const menuUnsubscribe = onSnapshot(query(collection(db, 'menuItems'), orderBy('createdAt', 'desc')), (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    });

    const usersUnsubscribe = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile)));
    });

    const reviewsUnsubscribe = onSnapshot(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')), (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const ordersUnsubscribe = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });

    return () => {
      resUnsubscribe();
      menuUnsubscribe();
      usersUnsubscribe();
      reviewsUnsubscribe();
      ordersUnsubscribe();
    };
  }, []);

  const handleUpdateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'reservations', id), { status });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await deleteDoc(doc(db, 'reservations', id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleMenuSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'menuItems', editingItem.id), menuFormData);
      } else {
        await addDoc(collection(db, 'menuItems'), { ...menuFormData, createdAt: serverTimestamp() });
      }
      setShowMenuForm(false);
      setEditingItem(null);
      setMenuFormData({ name: '', description: '', price: 0, category: 'Main Course', imageUrl: '', isAvailable: true, isPopular: false });
    } catch (err) {
      console.error('Menu operation failed:', err);
    }
  };

  const handleEditMenu = (item: MenuItem) => {
    setEditingItem(item);
    setMenuFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable ?? true,
      isPopular: item.isPopular ?? false
    });
    setShowMenuForm(true);
  };

  const handleDeleteMenu = async (id: string) => {
    if (window.confirm('Delete this menu item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
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
    <div className="min-h-screen bg-neutral-950 pb-24">
      {/* Dashboard Header */}
      <header className="bg-neutral-900 border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="overflow-hidden">
              <h1 className="text-3xl font-serif font-bold text-white mb-2 truncate">Admin Dashboard</h1>
              <p className="text-neutral-500 text-sm uppercase tracking-widest truncate">Sky View Abuja Management</p>
            </div>
            <div className="flex items-center space-x-4 shrink-0">
              <div className="bg-neutral-800 px-6 py-3 rounded-2xl border border-white/5">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Total Revenue</div>
                <div className="text-xl font-mono font-bold text-amber-500">₦{(reservations.filter(r => r.status === 'confirmed').reduce((acc, r) => acc + (r.guests * 15000), 0) + orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalAmount, 0)).toLocaleString()}</div>
              </div>
              <div className="bg-neutral-800 px-6 py-3 rounded-2xl border border-white/5">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Active Orders</div>
                <div className="text-xl font-mono font-bold text-amber-500">{orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex space-x-4 border-b border-white/5 mb-12 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative shrink-0 ${activeTab === 'reservations' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Reservations
            {activeTab === 'reservations' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative shrink-0 ${activeTab === 'orders' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Orders
            {activeTab === 'orders' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative shrink-0 ${activeTab === 'menu' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Menu
            {activeTab === 'menu' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative shrink-0 ${activeTab === 'users' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Users
            {activeTab === 'users' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative shrink-0 ${activeTab === 'reviews' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Reviews
            {activeTab === 'reviews' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'reservations' && (
            <motion.div 
              key="reservations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {reservations.map((res) => (
                  <div key={res.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/20 transition-colors overflow-hidden">
                    <div className="flex items-start space-x-4 overflow-hidden">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                        res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        <Calendar size={24} />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-lg truncate">{res.customerName}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-xs text-neutral-500 uppercase tracking-widest">
                          <span className="flex items-center space-x-1 shrink-0"><Calendar size={12} /> <span>{res.date}</span></span>
                          <span className="flex items-center space-x-1 shrink-0"><Clock size={12} /> <span>{res.time}</span></span>
                          <span className="flex items-center space-x-1 shrink-0"><Users size={12} /> <span>{res.guests} Guests</span></span>
                        </div>
                        {res.notes && <p className="text-neutral-400 text-xs mt-3 italic break-words">"{res.notes}"</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 shrink-0">
                      {res.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-colors"
                            title="Confirm"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteReservation(res.id)}
                        className="bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-500 p-3 rounded-xl transition-all border border-white/5"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/20 transition-colors overflow-hidden">
                    <div className="flex items-start space-x-4 overflow-hidden flex-grow">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        <ShoppingBag size={24} />
                      </div>
                      <div className="overflow-hidden flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg truncate">{order.customerName}</h3>
                          <span className="text-amber-500 font-mono font-bold">₦{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-neutral-400 flex justify-between">
                              <span>{item.name} x {item.quantity}</span>
                              <span className="text-neutral-600">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold">
                          <span className={`px-2 py-0.5 rounded ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                            order.status === 'preparing' ? 'bg-blue-500/20 text-blue-500' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                            'bg-amber-500/20 text-amber-500'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-neutral-600">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 shrink-0">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Prepare
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center space-x-2"
                        >
                          <PackageCheck size={16} />
                          <span>Deliver</span>
                        </button>
                      )}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          className="text-neutral-500 hover:text-red-500 p-2 transition-colors"
                          title="Cancel Order"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-dashed border-white/10">
                    <ShoppingBag size={48} className="mx-auto text-neutral-700 mb-4" />
                    <p className="text-neutral-500 uppercase tracking-widest text-sm">No orders found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif font-bold">Menu Items ({menuItems.length})</h2>
                <button 
                  onClick={() => { setEditingItem(null); setMenuFormData({ name: '', description: '', price: 0, category: 'Main Course', imageUrl: '', isAvailable: true, isPopular: false }); setShowMenuForm(true); }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 text-sm font-bold uppercase tracking-widest transition-all"
                >
                  <Plus size={18} />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden group flex flex-col">
                    <div className="h-40 relative shrink-0">
                      <img src={item.imageUrl || `https://picsum.photos/seed/${item.name}/400/300`} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button onClick={() => handleEditMenu(item)} className="bg-black/60 backdrop-blur-md p-2 rounded-lg text-white hover:text-amber-500 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteMenu(item.id)} className="bg-black/60 backdrop-blur-md p-2 rounded-lg text-white hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow overflow-hidden">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-bold truncate">{item.name}</h3>
                        <span className="text-amber-500 font-mono text-sm shrink-0">₦{item.price.toLocaleString()}</span>
                      </div>
                      <p className="text-neutral-500 text-xs mb-4 line-clamp-2 break-words">{item.description}</p>
                      <div className="mt-auto flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-neutral-400">{item.category}</span>
                        <span className={item.isAvailable ? 'text-green-500' : 'text-red-500'}>
                          {item.isAvailable ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-neutral-900 border border-white/5 rounded-3xl overflow-x-auto"
            >
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-neutral-500">
                    <th className="px-8 py-6 font-bold">User</th>
                    <th className="px-8 py-6 font-bold">Email</th>
                    <th className="px-8 py-6 font-bold">Role</th>
                    <th className="px-8 py-6 font-bold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          {u.photoURL ? (
                            <img src={u.photoURL} className="w-8 h-8 rounded-full shrink-0" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs shrink-0">
                              {u.displayName?.[0] || u.email[0]}
                            </div>
                          )}
                          <span className="font-medium truncate">{u.displayName || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-neutral-400 text-sm truncate">{u.email}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-neutral-500 text-xs whitespace-nowrap">
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {reviews.map((review) => (
                <div key={review.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden">
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-bold truncate">{review.userName}</span>
                      <div className="flex text-amber-500 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-400 text-sm italic break-words">"{review.comment}"</p>
                  </div>
                  <button onClick={() => handleDeleteReview(review.id)} className="text-neutral-500 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-dashed border-white/10">
                  <Star size={48} className="mx-auto text-neutral-700 mb-4" />
                  <p className="text-neutral-500 uppercase tracking-widest text-sm">No reviews yet</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Item Modal */}
      <AnimatePresence>
        {showMenuForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenuForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-neutral-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-serif font-bold mb-8">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <form onSubmit={handleMenuSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Item Name</label>
                  <input 
                    required
                    value={menuFormData.name}
                    onChange={e => setMenuFormData({...menuFormData, name: e.target.value})}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Image URL (Optional)</label>
                  <input 
                    value={menuFormData.imageUrl}
                    onChange={e => setMenuFormData({...menuFormData, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Description</label>
                  <textarea 
                    value={menuFormData.description}
                    onChange={e => setMenuFormData({...menuFormData, description: e.target.value})}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors resize-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Price (₦)</label>
                    <input 
                      type="number"
                      required
                      value={menuFormData.price}
                      onChange={e => setMenuFormData({...menuFormData, price: Number(e.target.value)})}
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Category</label>
                    <select 
                      value={menuFormData.category}
                      onChange={e => setMenuFormData({...menuFormData, category: e.target.value})}
                      className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Cocktails">Cocktails</option>
                      <option value="Wine">Wine</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={menuFormData.isAvailable}
                      onChange={e => setMenuFormData({...menuFormData, isAvailable: e.target.checked})}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${menuFormData.isAvailable ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                      {menuFormData.isAvailable && <Check size={14} className="text-black" />}
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold">Available</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={menuFormData.isPopular}
                      onChange={e => setMenuFormData({...menuFormData, isPopular: e.target.checked})}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${menuFormData.isPopular ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                      {menuFormData.isPopular && <Check size={14} className="text-black" />}
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold">Popular</span>
                  </label>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowMenuForm(false)}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-xl shadow-amber-600/20"
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
