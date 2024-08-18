import PageContainer from "@/components/layout/page-container";
import { menuCategories } from "@/constants/data";
import MenuCategoryItem from "./components/menu-category";

export default function DashboardPage() {
  return (
    <PageContainer scrollable={true}>
      <div>
        {/* Menu category cards */}
        <div className="flex gap-2">
          {menuCategories &&
            menuCategories.map((menu, index) => (
              <MenuCategoryItem key={index} menu={menu} />
            ))}
        </div>
      </div>
    </PageContainer>
  );
}
