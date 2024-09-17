import {
  MenuCuisine,
  NavItem,
  IFoodItem,
  ICuisineItem,
  PriceRange,
} from "@/types";

export const products: IFoodItem[] = [
  {
    _id: "1",
    imageName: "Quiche-Lorraine.png",
    name: "Quiche Lorraine",
    rating: 4.5,
    reviews: 123,
    price: 12,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "2",
    imageName: "Yakitori.png",
    name: "Yakitori",
    rating: 2.5,
    reviews: 123,
    price: 14,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "japonaise",
    isActive: true,
  },

  {
    _id: "3",
    imageName: "Palak-Paneer.png",
    name: "Palak Paneer",
    rating: 3,
    reviews: 123,
    price: 6,
    repas: "végétarien",
    repasType: "petit-déjeuner",
    cuisine: "indienne",
    isActive: false,
  },
  {
    _id: "4",
    imageName: "Steak-frites.png",
    name: "Steak frites",
    rating: 5,
    reviews: 123,
    price: 4,
    repas: "non-végétarien",
    repasType: "déjeuner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "5",
    imageName: "Dal-Makhani.png",
    name: "Dal Makhani",
    rating: 1,
    reviews: 123,
    price: 6,
    repas: "végétarien",
    repasType: "petit-déjeuner",
    cuisine: "indienne",
    isActive: false,
  },
  {
    _id: "6",
    imageName: "Biryani.png",
    name: "Biryani",
    rating: 3,
    reviews: 123,
    price: 7,
    repas: "non-végétarien",
    repasType: "déjeune",
    cuisine: "indienne",
    isActive: false,
  },

  {
    _id: "7",
    imageName: "Pizza.png",
    name: "Pizza",
    rating: 4.5,
    reviews: 123,
    price: 5,
    repas: "végétarien",
    repasType: "déjeune",
    cuisine: "italienne",
    isActive: true,
  },

  {
    _id: "8",
    imageName: "Soupe-oignon-gratinée.png",
    name: "Soupe à l'oignon gratinée",
    rating: 4.5,
    reviews: 123,
    price: 5,
    repas: "végétarien",
    repasType: "petit-déjeuner",
    cuisine: "français",
    isActive: true,
  },

  {
    _id: "9",
    imageName: "Poulet-au-beurre.png",
    name: "Poulet au beurre",
    rating: 4.5,
    reviews: 123,
    price: 8,
    repas: "non-végétarien",
    repasType: "dîner",
    cuisine: "indienne",
    isActive: true,
  },

  {
    _id: "10",
    imageName: "Boeuf-Bourguignon.png",
    name: "Boeuf Bourguignon",
    rating: 4.5,
    reviews: 123,
    price: 10,
    repas: "non-végétarien",
    repasType: "petit-déjeuner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "11",
    imageName: "Lasagna.png",
    name: "Lasagna",
    rating: 4.5,
    reviews: 123,
    price: 14,
    repas: "non-végétarien",
    repasType: "non-végétarien",
    cuisine: "italienne",
    isActive: false,
  },
  {
    _id: "12",
    imageName: "Crêpes.png",
    name: "Crêpes",
    rating: 4.5,
    reviews: 123,
    price: 15,
    repas: "non-végétarien",
    repasType: "dîner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "13",
    imageName: "Ratatouille.png",
    name: "Ratatouille",
    rating: 4.5,
    reviews: 123,
    price: 17,
    repas: "non-végétarien",
    repasType: "dîner",
    cuisine: "français",
    isActive: true,
  },

  {
    _id: "14",
    imageName: "Magret-de-Canard.png",
    name: "Magret de Canard",
    rating: 4.5,
    reviews: 123,
    price: 21,
    repas: "non-végétarien",
    repasType: "dînerr",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "15",
    imageName: "Pasta.png",
    name: "Pasta",
    rating: 4.5,
    reviews: 123,
    price: 9,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "italienne",
    isActive: true,
  },
  {
    _id: "16",
    imageName: "Salade-Niçoise.png",
    name: "Salade Niçoise",
    rating: 4.5,
    reviews: 123,
    price: 7,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "17",
    imageName: "Blanquette-de-Veau.png",
    name: "Blanquette de Veau",
    rating: 4.5,
    reviews: 123,
    price: 16,
    repas: "végétarien",
    repasType: "dîner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "18",
    imageName: "Soufflé.png",
    name: "Soufflé",
    rating: 4.5,
    reviews: 123,
    price: 22,
    repas: "déjeuner",
    repasType: "non-végétarien",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "19",
    imageName: "Coq-au-vin.png",
    name: "Coq au vin",
    rating: 4.5,
    reviews: 123,
    price: 12,
    repas: "non-végétarien",
    repasType: "déjeuner",
    cuisine: "français",
    isActive: true,
  },
  {
    _id: "20",
    imageName: "Dropa-Khatsa.png",
    name: "Dropa Khatsa",
    rating: 4.5,
    reviews: 123,
    price: 8,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "tibétaine",
    isActive: true,
  },
  {
    _id: "21",
    imageName: "Momos.png",
    name: "Momos",
    rating: 4.5,
    reviews: 123,
    price: 8,
    repas: "non-végétarien",
    repasType: "dîner",
    cuisine: "tibétaine",
    isActive: true,
  },
  {
    _id: "22",
    imageName: "Thenthuk.png",
    name: "Thenthuk",
    rating: 4.5,
    reviews: 123,
    price: 10,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "tibétaine",
    isActive: true,
  },
  {
    _id: "23",
    imageName: "Cassoulet.png",
    name: "Cassoulet",
    rating: 4.5,
    reviews: 123,
    price: 12,
    repas: "végétarien",
    repasType: "déjeuner",
    cuisine: "français",
    isActive: true,
  },

  {
    _id: "24",
    imageName: "Búnchả.png",
    name: "Bún chả",
    rating: 4.5,
    reviews: 123,
    price: 20,
    repas: "végétarien",
    repasType: "dîner",
    cuisine: "vietnamienne",
    isActive: true,
  },
  {
    _id: "25",
    imageName: "Phở.png",
    name: "Phở",
    rating: 4.5,
    reviews: 123,
    price: 8,
    repas: "non-végétarien",
    repasType: "dîner",
    cuisine: "vietnamienne",
    isActive: true,
  },
  {
    _id: "26",
    imageName: "Sushi.png",
    name: "Sushi",
    rating: 4.5,
    reviews: 123,
    price: 22,
    repas: "non-végétarien",
    repasType: "dîner",
    cuisine: "japonaise",
    isActive: true,
  },
  {
    _id: "27",
    imageName: "Gỏi-Cuốn.png",
    name: "Gỏi Cuốn",
    rating: 4.5,
    reviews: 123,
    price: 11,
    repas: "non-végétarien",
    repasType: "non-végétarien",
    cuisine: "vietnamienne",
    isActive: true,
  },
  {
    _id: "28",
    imageName: "Tempura.png",
    name: "Tempura",
    rating: 4.5,
    reviews: 123,
    price: 21,
    repas: "non-végétarien",
    repasType: "déjeuner",
    cuisine: "japonaise",
    isActive: true,
  },
];

export type User = {
  _id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const users: User[] = [
  {
    _id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    _id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    _id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    _id: 4,
    name: "Dav_id Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    _id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    _id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    _id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    _id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    _id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    _id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export type Employee = {
  _id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Cons_ider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const menuCategories: MenuCuisine[] = [
  {
    id: "all",
    name: "all",
    icon: "foodPot",
    shortDescription: "256 menus",
  },
  {
    id: "petit-dejeuner",
    name: "Petit Déjeuner",
    icon: "coffee",
    shortDescription: "50 menus",
  },
  {
    id: "dejeuner",
    name: "Déjeuner",
    icon: "soup",
    shortDescription: "56 menu",
  },
  {
    id: "diner",
    name: "Dîner",
    icon: "utensils",
    shortDescription: "60 menus",
  },
];

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: "dashboard",
    label: "Home",
  },
  {
    title: "Order",
    href: "/orders",
    icon: "billing",
    label: "Home",
  },
  {
    title: "Account",
    href: "/account",
    icon: "profile",
    label: "acount",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
    label: "settings",
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/admin/dashboard",
    icon: "dashboard",
    label: "Home",
  },
  {
    title: "Order",
    href: "/admin/dashboard/orders",
    icon: "billing",
    label: "Orders",
  },
  {
    title: "Products",
    href: "/admin/dashboard/products",
    icon: "products",
    label: "Products",
  },
  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    icon: "settings",
    label: "settings",
  },
];
export const categories: ICuisineItem[] = [
  { id: "all", label: "Toute" },
  { id: "français", label: "Français" },
  { id: "indienne", label: "Indienne" },
  { id: "japonaise", label: "Japonaise" },
  { id: "italienne", label: "Italienne" },
  { id: "tibétaine", label: "Tibétaine" },
  { id: "vietnamienne", label: "Vietnamienne" },
];

export const weeklyVisiterOrders = [
  { name: "Mon", visits: 40, orders: 24 },
  { name: "Tue", visits: 30, orders: 11 },
  { name: "Wed", visits: 20, orders: 9 },
  { name: "Thu", visits: 27, orders: 3 },
  { name: "Fri", visits: 18, orders: 4 },
  { name: "Sat", visits: 23, orders: 3 },
  { name: "Sun", visits: 34, orders: 4 },
];
