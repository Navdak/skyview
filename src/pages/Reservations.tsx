import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, MessageSquare, CheckCircle2, AlertCircle, Star } from 'lucide-react';

const reservationSchema = z.object({
  customerName: z.string().min(2, 'Name is too short'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Invalid phone number'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  guests: z.number().min(1, 'At least 1 guest').max(20, 'For more than 20 guests, please contact us directly'),
  notes: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationsProps {
  user: UserProfile | null;
  onLogin: () => void;
}

export default function Reservations({ user, onLogin }: ReservationsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      customerName: user?.displayName || '',
      customerEmail: user?.email || '',
    }
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'reservations'), {
        ...data,
        userId: user?.uid || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      reset();
    } catch (err) {
      console.error('Reservation failed:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070" 
            alt="Reservations Background" 
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
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tighter">Book a <span className="text-amber-500 italic">Table</span></h1>
            <p className="text-neutral-400 max-w-xl mx-auto font-light tracking-widest uppercase text-xs">
              Secure your spot at Abuja's most exclusive rooftop
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-serif font-bold mb-6 text-amber-500">Reservation Policy</h3>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <Clock className="text-amber-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Grace Period</h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">We hold tables for 15 minutes after the scheduled time.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <Users className="text-amber-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Large Groups</h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">For parties larger than 20, please call us for special arrangements.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <Star className="text-amber-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Special Occasions</h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">Let us know if you're celebrating a birthday or anniversary!</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/20 rounded-3xl p-8">
              <h3 className="text-lg font-serif font-bold mb-4">Need Help?</h3>
              <p className="text-neutral-400 text-sm mb-6">Our concierge team is available to assist you with any special requests.</p>
              <a href="tel:+234800SKYVIEW" className="block text-center bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
                Call Concierge
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold mb-4">Reservation Received!</h2>
                  <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                    Thank you for choosing Sky View Abuja. We've received your request and will confirm it shortly via email.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    Make Another Booking
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Full Name</label>
                      <input 
                        {...register('customerName')}
                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                        placeholder="John Doe"
                      />
                      {errors.customerName && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.customerName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Email Address</label>
                      <input 
                        {...register('customerEmail')}
                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                      {errors.customerEmail && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.customerEmail.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Phone Number</label>
                      <input 
                        {...register('customerPhone')}
                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                        placeholder="+234 ..."
                      />
                      {errors.customerPhone && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.customerPhone.message}</p>}
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Number of Guests</label>
                      <input 
                        type="number"
                        {...register('guests', { valueAsNumber: true })}
                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                      />
                      {errors.guests && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.guests.message}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Date</label>
                      <div className="relative">
                        <input 
                          type="date"
                          {...register('date')}
                          className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors appearance-none"
                        />
                        <Calendar className="absolute right-4 top-3 text-neutral-500 pointer-events-none" size={18} />
                      </div>
                      {errors.date && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.date.message}</p>}
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Time</label>
                      <div className="relative">
                        <select 
                          {...register('time')}
                          className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors appearance-none"
                        >
                          <option value="">Select Time</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                        </select>
                        <Clock className="absolute right-4 top-3 text-neutral-500 pointer-events-none" size={18} />
                      </div>
                      {errors.time && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.time.message}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Special Notes (Optional)</label>
                    <textarea 
                      {...register('notes')}
                      rows={4}
                      className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors resize-none"
                      placeholder="Birthday, anniversary, allergies, etc."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center space-x-3 text-red-500 text-sm">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  {!user && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
                      <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Login to track your bookings</p>
                      <button type="button" onClick={onLogin} className="text-amber-500 hover:text-amber-400 text-xs font-black uppercase tracking-widest">Login Now</button>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white py-5 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center space-x-3"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        <span>Confirm Reservation</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
