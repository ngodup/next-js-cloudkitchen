import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { MenuCategory } from "@/types";

interface MenuCategoryProps {
  menu: MenuCategory;
}

const MenuCategoryItem = ({ menu }: MenuCategoryProps) => {
  const { name, icon, shortDescription } = menu;
  const Icon = Icons[icon || "foodPot"];

  return (
    <Card className="w-25 p-2 rounded-2xl">
      <CardContent className="flex gap-2 pb-0 justify-between">
        {/* <LayoutDashboardIcon className="text-primary" size={30} /> */}
        <Icon className={`size-8 text-primary flex-none`} />
        <div className="text-xs">
          <p className="font-semibold">{name}</p>
          <p>{shortDescription}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCategoryItem;
