/**
 * Fixture for the hardcoded baseline screen. Mirrors homeSDUI.json exactly —
 * same sections, same cars, same images — so the perf comparison isolates the
 * engine overhead, not content differences.
 */

export interface StaticCar {
  id: string;
  category: 'suv' | 'sedan' | 'hatchback' | 'luxury';
  title: string;
  subtitle: string;
  price: string;
  emi: string;
  year: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  tag: string;
  imageUrl: string;
}

export const STATIC_HEADER_DATA = {
  title: 'CARS24',
  subtitle: 'Drive Quality Used Cars',
  location: 'Gurgaon, NCR ▾',
  searchPlaceholder: 'Search Swift, Creta, City...',
};

export const STATIC_CHIPS_DATA = [
  { id: 'all', label: 'All Cars', icon: '🚘' },
  { id: 'suv', label: 'SUVs', icon: '🚙' },
  { id: 'sedan', label: 'Sedans', icon: '🏎️' },
  { id: 'hatchback', label: 'Hatchbacks', icon: '🚗' },
  { id: 'luxury', label: 'Luxury', icon: '✨' },
];

export const STATIC_BANNER_DATA = {
  title: '7-Day Easy Return Guarantee',
  subtitle: '100% money-back guarantee, no questions asked',
  ctaText: 'Learn About Warranty',
  badge: 'CARS24 ASSURED',
  backgroundColor: '#0F172A',
  textColor: '#FFFFFF',
};

export const STATIC_TENURES = [
  { id: '24', label: '24 mo', emi: '26,300' },
  { id: '36', label: '36 mo', emi: '18,450' },
  { id: '48', label: '48 mo', emi: '14,600' },
  { id: '60', label: '60 mo', emi: '12,150' },
];

export const STATIC_FEATURED_CARS: StaticCar[] = [
  {
    id: 'car_1',
    category: 'suv',
    title: 'Hyundai Creta SX 1.5',
    subtitle: '1.5 Petrol • Manual',
    price: '₹11.45 Lakh',
    emi: '₹18,450',
    year: 2022,
    mileage: '24,500 km',
    fuelType: 'Petrol',
    transmission: 'Manual',
    tag: '140-Point Inspected',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80',
  },
  {
    id: 'car_2',
    category: 'hatchback',
    title: 'Maruti Swift ZXI+',
    subtitle: '1.2 Dualjet Petrol',
    price: '₹6.80 Lakh',
    emi: '₹10,950',
    year: 2021,
    mileage: '18,200 km',
    fuelType: 'Petrol',
    transmission: 'Manual',
    tag: 'Zero Down Payment',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80',
  },
  {
    id: 'car_3',
    category: 'suv',
    title: 'Tata Nexon XZ+ (S)',
    subtitle: '1.2 Revotron Turbo',
    price: '₹9.25 Lakh',
    emi: '₹14,900',
    year: 2023,
    mileage: '12,100 km',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    tag: '5-Star Safety',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&q=80',
  },
  {
    id: 'car_6',
    category: 'luxury',
    title: 'BMW 3 Series 330i',
    subtitle: '2.0 Twin-Turbo Petrol',
    price: '₹28.90 Lakh',
    emi: '₹46,500',
    year: 2021,
    mileage: '31,000 km',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    tag: 'Luxury Certified',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80',
  },
];

export const STATIC_POPULAR_CARS: StaticCar[] = [
  {
    id: 'car_4',
    category: 'sedan',
    title: 'Honda City ZX',
    subtitle: '1.5 i-VTEC',
    price: '₹10.50 Lakh',
    emi: '₹16,900',
    year: 2020,
    mileage: '36,000 km',
    fuelType: 'Petrol',
    transmission: 'CVT',
    tag: '1st Owner',
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?w=500&q=80',
  },
  {
    id: 'car_5',
    category: 'suv',
    title: 'Kia Seltos HTX',
    subtitle: '1.5 Diesel',
    price: '₹12.90 Lakh',
    emi: '₹20,800',
    year: 2021,
    mileage: '29,400 km',
    fuelType: 'Diesel',
    transmission: 'Manual',
    tag: 'CARS24 Certified',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80',
  },
  {
    id: 'car_7',
    category: 'hatchback',
    title: 'Maruti Baleno Alpha',
    subtitle: '1.2 Petrol',
    price: '₹7.35 Lakh',
    emi: '₹11,850',
    year: 2022,
    mileage: '15,800 km',
    fuelType: 'Petrol',
    transmission: 'AMT',
    tag: 'Low Mileage',
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&q=80',
  },
  {
    id: 'car_8',
    category: 'sedan',
    title: 'Hyundai Verna SX(O)',
    subtitle: '1.5 Turbo',
    price: '₹13.20 Lakh',
    emi: '₹21,300',
    year: 2023,
    mileage: '9,600 km',
    fuelType: 'Petrol',
    transmission: 'DCT',
    tag: 'Almost New',
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80',
  },
];

export const STATIC_VALUE_PROPS = [
  { icon: '🔍', value: '140', label: 'Point Inspection' },
  { icon: '↩️', value: '7 Days', label: 'Easy Returns' },
  { icon: '🛡️', value: '1 Year', label: 'Warranty' },
];
