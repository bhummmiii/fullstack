import { useState } from 'react';
import { Users, Clock, Plus, X, CheckCircle, Calendar } from 'lucide-react';

import { StatusBadge } from './shared/StatusBadge';







export function AmenityBooking({ userRole, currentFlatNumber }) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState('');

  const amenities= [
    { id: 'clubhouse', name: 'Clubhouse', icon: '🏢', description: 'Multi-purpose hall for events', capacity: 50, timings: '9 AM – 11 PM', bookingFee: 2000, available: true },
    { id: 'gym', name: 'Gymnasium', icon: '💪', description: 'Fully equipped fitness center', capacity: 10, timings: '6 AM – 10 PM', bookingFee: 0, available: true },
    { id: 'pool', name: 'Swimming Pool', icon: '🏊', description: 'Olympic size swimming pool', capacity: 20, timings: '6 AM – 8 PM', bookingFee: 0, available: true },
    { id: 'lawn', name: 'Community Lawn', icon: '🌳', description: 'Open space for outdoor events', capacity: 100, timings: '6 AM – 10 PM', bookingFee: 1500, available: true },
  ];

  const [bookings, setBookings] = useState([
    { id: 1, amenity: 'Clubhouse',       flatNumber: 'A-101', residentName: 'Jayawant Gore', date: '2026-04-05', timeSlot: '6:00 PM – 10:00 PM', guests: 30, status: 'confirmed', purpose: 'Birthday Party'            },
    { id: 2, amenity: 'Community Lawn',  flatNumber: 'B-204', residentName: 'Priya Sharma',  date: '2026-04-12', timeSlot: '4:00 PM – 9:00 PM',  guests: 50, status: 'confirmed', purpose: 'Anniversary Celebration' },
    { id: 3, amenity: 'Clubhouse',       flatNumber: 'C-302', residentName: 'Amit Patel',    date: '2026-04-18', timeSlot: '7:00 PM – 11:00 PM', guests: 40, status: 'pending',   purpose: 'Office Party'            },
  ]);

  const [newBooking, setNewBooking] = useState({ amenity: '', date: '', timeSlot: '', guests: 1, purpose: '' });

  const handleBook = (amenityId) => {
    setSelectedAmenity(amenityId);
    setShowBookingModal(true);
  };

  const handleCreateBooking = () => {
    const amenity = amenities.find(a => a.id === selectedAmenity);
    if (!amenity) return;
    const booking= {
      id: bookings.length + 1,
      amenity: amenity.name,
      flatNumber: currentFlatNumber,
      residentName: 'Current User',
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      guests: newBooking.guests,
      status: userRole === 'admin' ? 'confirmed' : 'pending',
      purpose: newBooking.purpose,
    };
    setBookings([booking, ...bookings]);
    setShowBookingModal(false);
    setNewBooking({ amenity: '', date: '', timeSlot: '', guests: 1, purpose: '' });
  };

  const handleApprove = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
  };

  const handleReject = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b));
  };

  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
    borderRadius: '0.75rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ color: '#3D4127' }} className="mb-1">Amenity Booking</h1>
        <p className="text-sm" style={{ color: '#6b7155' }}>Book community facilities and amenities</p>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="bg-white rounded-xl p-5 transition-all hover:-translate-y-0.5"
            style={{ border: '1px solid rgba(99,107,47,0.12)' }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.boxShadow = '0 8px 25px rgba(99,107,47,0.1)';
              (e.currentTarget).style.borderColor = 'rgba(99,107,47,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.boxShadow = '';
              (e.currentTarget).style.borderColor = 'rgba(99,107,47,0.12)';
            }}
          >
            <div className="text-4xl mb-3">{amenity.icon}</div>
            <h3 className="text-sm mb-1" style={{ color: '#1a1e0f' }}>{amenity.name}</h3>
            <p className="text-xs mb-4" style={{ color: '#6b7155' }}>{amenity.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7155' }}>
                <Users className="w-3.5 h-3.5" style={{ color: '#BAC095' }} />
                Capacity: {amenity.capacity}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7155' }}>
                <Clock className="w-3.5 h-3.5" style={{ color: '#BAC095' }} />
                {amenity.timings}
              </div>
              <div className="text-xs" style={{ color: amenity.bookingFee > 0 ? '#636B2F' : '#16a34a' }}>
                {amenity.bookingFee > 0 ? `₹${amenity.bookingFee} booking fee` : 'Free to use'}
              </div>
            </div>
            <button
              onClick={() => handleBook(amenity.id)}
              className="w-full py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-md hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,107,47,0.12)' }}>
        <div className="p-5" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
          <h2 style={{ color: '#3D4127' }} className="mb-0.5">
            {userRole === 'admin' ? 'All Bookings' : 'Your Bookings'}
          </h2>
          <p className="text-xs" style={{ color: '#9aA278' }}>Upcoming and past reservations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'rgba(212,222,149,0.1)', borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
              <tr>
                {['Amenity', ...(userRole === 'admin' ? ['Resident'] : []), 'Date', 'Time Slot', 'Guests', 'Purpose', 'Status', ...(userRole === 'admin' ? ['Actions'] : [])].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr
                  key={booking.id}
                  className="transition-colors"
                  style={{ borderBottom: idx < bookings.length - 1 ? '1px solid rgba(186,192,149,0.15)' : 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,222,149,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-6 py-4 text-sm" style={{ color: '#1a1e0f' }}>{booking.amenity}</td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: '#1a1e0f' }}>{booking.residentName}</div>
                      <div className="text-xs" style={{ color: '#9aA278' }}>{booking.flatNumber}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>
                    {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>{booking.timeSlot}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>{booking.guests}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>{booking.purpose || '—'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'error'}
                      label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      size="sm"
                    />
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4">
                      {booking.status === 'pending' && (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleApprove(booking.id)}
                            className="text-xs transition-colors hover:underline" 
                            style={{ color: '#16a34a' }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(booking.id)}
                            className="text-xs transition-colors hover:underline" 
                            style={{ color: '#dc2626' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {booking.status !== 'pending' && (
                        <span className="text-xs" style={{ color: '#9aA278' }}>—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" style={{ border: '1px solid rgba(99,107,47,0.2)' }}>
            <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,107,47,0.1)' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#636B2F' }} />
                </div>
                <div>
                  <h2 style={{ color: '#3D4127' }}>Book {amenities.find(a => a.id === selectedAmenity)?.name}</h2>
                  <p className="text-xs" style={{ color: '#9aA278' }}>Select date and time slot</p>
                </div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: '#9aA278' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Date *</label>
                <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} min={new Date().toISOString().split('T')[0]} style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Time Slot *</label>
                <select value={newBooking.timeSlot} onChange={(e) => setNewBooking({ ...newBooking, timeSlot: e.target.value })} style={inputStyle}>
                  <option value="">Select time slot</option>
                  <option value="6:00 AM – 10:00 AM">6:00 AM – 10:00 AM</option>
                  <option value="10:00 AM – 2:00 PM">10:00 AM – 2:00 PM</option>
                  <option value="2:00 PM – 6:00 PM">2:00 PM – 6:00 PM</option>
                  <option value="6:00 PM – 10:00 PM">6:00 PM – 10:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Number of Guests *</label>
                <input type="number" min="1" max={amenities.find(a => a.id === selectedAmenity)?.capacity || 100} value={newBooking.guests} onChange={(e) => setNewBooking({ ...newBooking, guests: parseInt(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Purpose (Optional)</label>
                <textarea value={newBooking.purpose} onChange={(e) => setNewBooking({ ...newBooking, purpose: e.target.value })} placeholder="e.g., Birthday Party, Meeting..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              {(amenities.find(a => a.id === selectedAmenity)?.bookingFee ?? 0) > 0 && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(212,222,149,0.15)', border: '1px solid rgba(186,192,149,0.35)' }}>
                  <p className="text-sm" style={{ color: '#3D4127' }}>
                    <strong>Booking Fee:</strong> ₹{amenities.find(a => a.id === selectedAmenity)?.bookingFee}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(186,192,149,0.3)' }}>
              <button onClick={() => setShowBookingModal(false)} className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1.5px solid rgba(186,192,149,0.5)', color: '#3D4127', background: '#f8f9f4' }}>
                Cancel
              </button>
              <button onClick={handleCreateBooking} disabled={!newBooking.date || !newBooking.timeSlot} className="px-5 py-2.5 rounded-xl text-white text-sm transition-all disabled:opacity-50 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
