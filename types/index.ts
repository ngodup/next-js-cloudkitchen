import { Icons } from "@/components/icons";

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

export type MenuCategory = {
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