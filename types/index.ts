import { Icons } from "@/components/icons";
import { ProductState } from "@/store/products/products-slice";

/**
 * Represents a single navigation item.
 */
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  icon?: keyof typeof Icons;
  label?: string; // Optional label for additional context
  description?: string; // Optional description for the item
}

export type MenuCuisine = {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  shortDescription: string;
};

/**
 * Represents a navigation item that can have child items.
 */
export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]; // Child navigation items
}

/**
 * Represents a navigation item that may have optional child items.
 */
export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]; // Optional child navigation items
}

/**
 * Represents a footer item with a title and a list of links.
 */
export interface FooterItem {
  title: string; // The title of the footer item
  items: {
    title: string; // The title of the link
    href: string; // The URL the link points to
    external?: boolean; // Indicates if the link is external
  }[];
}

// Type aliases for clarity
export type MainNavItem = NavItemWithOptionalChildren;
export type SidebarNavItem = NavItemWithChildren;

export interface IFoodItem {
  _id?: string;
  imageName: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  repas: string;
  repasType: string;
  cuisine: string;
  active: boolean;
}

export interface IComment {
  _id?: string;
  content: string;
  createdAt: Date;
  productId: string;
  userId: string;
  rating?: number;
}

export interface IOrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  imageName: string;
}

export interface IUserProfile {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  bio?: string;
  avatarUrl: string;
}

export interface IAddress {
  _id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
}
export interface IOrder {
  _id: string;
  userId: string;
  products: IOrderProduct[];
  totalItems: number;
  totalPrice: number;
  status: string;
  orderDate: string;
}

export interface ICuisineItem {
  id: string;
  label: string;
}

export interface PriceRange {
  id: string;
  label: string;
}

/* Start of Redux related type */
export interface RootState {
  products: ProductState;
  carts: IOrderProduct;
}

/* End here redux related type */
