import { User, Phone, Mail, MapPin } from 'lucide-react';
import { UserData } from '../App';

type Props = {
  data: UserData;
  onUpdate: (data: UserData) => void;
  onNext: () => void;
};

export function RegistrationStep({ data, onUpdate, onNext }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.fullName && data.phone && data.email && data.location) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Start Your House Estimation</h2>
      <p className="text-gray-600 mb-8">Please provide your contact details to begin</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onUpdate({ ...data, fullName: e.target.value })}
              placeholder="Enter your full name"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9420] focus:border-[#ED9420] outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onUpdate({ ...data, phone: e.target.value })}
              placeholder="07X XXX XXXX"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9420] focus:border-[#ED9420] outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onUpdate({ ...data, email: e.target.value })}
              placeholder="example@gmail.com"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9420] focus:border-[#ED9420] outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Building Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={data.location}
              onChange={(e) => onUpdate({ ...data, location: e.target.value })}
              placeholder="Enter your building location"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9420] focus:border-[#ED9420] outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#ED9420] hover:bg-[#d67f12] text-white font-semibold py-4 rounded-lg transition-colors duration-200 mt-8"
        >
          Next Step
        </button>
      </form>
    </div>
  );
}
