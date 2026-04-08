import { Phone, Mail, MapPin, Shield, AlertTriangle, Flame, Droplet, Building2 } from 'lucide-react';

export function EmergencyContacts() {
  const emergencyNumbers = [
    { name: 'Police', number: '100', icon: Shield, bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
    { name: 'Fire Brigade', number: '101', icon: Flame, bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
    { name: 'Ambulance', number: '102', icon: Building2, bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  ];

  const societyContacts = [
    { name: 'Society Secretary', designation: 'Mr. Jayawant Gore', phone: '+91 98765 43210', email: 'secretary@omsaiapartment.com', available: '24/7', bg: 'rgba(99,107,47,0.1)', color: '#636B2F' },
    { name: 'Security Head', designation: 'Mr. Ramesh Singh', phone: '+91 98765 43211', email: 'security@omsaiapartment.com', available: '24/7', bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
    { name: 'Maintenance Head', designation: 'Mr. Suresh Patel', phone: '+91 98765 43212', email: 'maintenance@omsaiapartment.com', available: '8 AM – 8 PM', bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
    { name: 'Plumber', designation: 'Mr. Ravi', phone: '+91 98765 43213', email: 'plumber@omsaiapartment.com', available: '8 AM – 6 PM', bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
  ];

  const nearbyHospitals = [
    { name: 'City Hospital', address: 'MG Road, 2 km away', phone: '+91 22 1234 5678', type: '24/7 Emergency' },
    { name: 'Apollo Clinic', address: 'Station Road, 1.5 km away', phone: '+91 22 1234 5679', type: 'General & Emergency' },
  ];

  const nearbyPolice = [
    { name: 'Central Police Station', address: 'Main Street, 1 km away', phone: '+91 22 1234 5680', type: 'Police Station' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ color: '#2c3018' }} className="mb-1">Emergency Contacts</h1>
        <p style={{ color: '#8a9268', fontSize: '0.8125rem' }}>Important contact numbers for emergencies</p>
      </div>

      {/* Emergency Alert Banner */}
      <div
        className="p-5 rounded-2xl flex items-start gap-4"
        style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.12)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(220,38,38,0.12)' }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626' }} />
        </div>
        <div>
          <h3 className="text-sm mb-1" style={{ color: '#b91c1c' }}>Emergency Services – India</h3>
          <p className="text-xs" style={{ color: '#6b7155' }}>
            In any emergency, call these numbers first before contacting society management.
          </p>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {emergencyNumbers.map((contact, i) => (
          <a
            key={i}
            href={`tel:${contact.number}`}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg group"
            style={{ border: '1px solid rgba(220,38,38,0.1)', textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: contact.bg }}
            >
              <contact.icon className="w-6 h-6" style={{ color: contact.color }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#1a1e0f' }}>{contact.name}</p>
              <p className="text-2xl" style={{ color: contact.color }}>{contact.number}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Society Management */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
      >
        <div className="p-5" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
          <h2 style={{ color: '#3D4127' }} className="mb-0.5">Society Management</h2>
          <p className="text-xs" style={{ color: '#9aA278' }}>Key contacts for society operations</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {societyContacts.map((contact, i) => (
            <div
              key={i}
              className="p-4 rounded-xl transition-all hover:shadow-md"
              style={{ border: '1px solid rgba(186,192,149,0.3)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: contact.bg }}
                >
                  <Shield className="w-5 h-5" style={{ color: contact.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-0.5" style={{ color: '#1a1e0f' }}>{contact.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#6b7155' }}>{contact.designation}</p>
                  <div className="space-y-1.5">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-xs transition-colors"
                      style={{ color: '#636B2F', textDecoration: 'none' }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {contact.phone}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-xs transition-colors"
                      style={{ color: '#6b7155', textDecoration: 'none' }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {contact.email}
                    </a>
                    <p className="flex items-center gap-2 text-xs" style={{ color: '#9aA278' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Available: {contact.available}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,107,47,0.12)' }}>
        <div className="p-5" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
          <h2 style={{ color: '#3D4127' }} className="mb-0.5">Nearby Hospitals</h2>
        </div>
        <div className="p-5 space-y-3">
          {nearbyHospitals.map((hospital, i) => (
            <div key={i} className="p-4 rounded-xl transition-all hover:shadow-md" style={{ border: '1px solid rgba(186,192,149,0.3)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm" style={{ color: '#1a1e0f' }}>{hospital.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>
                      {hospital.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: '#6b7155' }}>
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#BAC095' }} />
                    {hospital.address}
                  </div>
                  <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 text-xs" style={{ color: '#636B2F', textDecoration: 'none' }}>
                    <Phone className="w-3.5 h-3.5" /> {hospital.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Police */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,107,47,0.12)' }}>
        <div className="p-5" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
          <h2 style={{ color: '#3D4127' }} className="mb-0.5">Nearby Police Stations</h2>
        </div>
        <div className="p-5 space-y-3">
          {nearbyPolice.map((station, i) => (
            <div key={i} className="p-4 rounded-xl transition-all hover:shadow-md" style={{ border: '1px solid rgba(186,192,149,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm" style={{ color: '#1a1e0f' }}>{station.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,107,47,0.1)', color: '#636B2F' }}>
                  {station.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: '#6b7155' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#BAC095' }} /> {station.address}
              </div>
              <a href={`tel:${station.phone}`} className="flex items-center gap-2 text-xs" style={{ color: '#636B2F', textDecoration: 'none' }}>
                <Phone className="w-3.5 h-3.5" /> {station.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: 'rgba(212,222,149,0.15)', border: '1px solid rgba(186,192,149,0.35)' }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#636B2F' }} />
        <p className="text-sm" style={{ color: '#3D4127' }}>
          <strong>Note:</strong> In any emergency, always call the relevant national emergency service
          first (100/101/102) before contacting society management.
        </p>
      </div>
    </div>
  );
}
