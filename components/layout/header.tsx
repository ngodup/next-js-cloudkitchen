import SearchInput from "@/app/(app)/components/search-input";
import ThemeToggle from "./ThemeToggle/theme-toggle";
import UserNav from "./user-nav";

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className="flex items-center gap-2 w-full">
          <SearchInput placeholder="Search..." className="flex-grow" />
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
