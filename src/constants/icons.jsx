import React from 'react';
import {
  MapPin, ArrowRight, Bus, Calendar, Hotel, Star, Phone, 
  ArrowLeft, Package, Filter, Tag, SearchX, Search, ArrowDownUp,
  Building, Plane, Clock, Users,DollarSign, ChevronLeft, ChevronRight,
  Wifi,Coffee,CheckCircle,User,Info,Car,Mail, ShieldCheck, Menu,
  X
} from 'lucide-react';

const icons = {
  location: <MapPin size={16} />,
  bus: <Bus size={16} />,
  calendar: <Calendar size={16} />,
  calendarMedium: <Calendar size={20} />,
  hotel: <Hotel size={16} />,
  hotelMedium: <Hotel size={20} />,
  star: <Star size={14} className="pkg-star-yellow" />,
  arrow: <ArrowRight size={18} />,
  phone: <Phone size={16} />,
  backArrow: <ArrowLeft size={20} />,
  packageBanner: <Package size={36} />,
  sort: <ArrowDownUp size={22} />,
  building: <Building size={22} />,
  tag: <Tag size={22} />,
  search: <Search size={22} />,
  searchLarge: <Search size={40} />, // Para el estado vacío de transportes
  filterBadge: <Filter size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />,
  searchX: <SearchX size={40} />,
  planeButton: <Plane size={18} />,
  busButton: <Bus size={18} />,
  clock: <Clock size={18} />,
  users: <Users size={16}/>,
  user: <User size={16}/>,
  dollar: <DollarSign size={16} />,
  chevronLeft: <ChevronLeft size={16}/>,
  ChevronRight: <ChevronRight size={16}/>,
  wifi: <Wifi size={16}/>,
  coffe: <Coffee size={16}/>,
  bus:<Bus size={16}/>,
  checkCircle: <CheckCircle size={16}/>,
  info: <Info size={20}/>,
  car: <Car size={20}/>,
  email: <Mail size={20}/>,
  protected: <ShieldCheck size={20}/>,
  menu: <Menu size={20} />,
  close: <X size={20} />
};

export default icons;