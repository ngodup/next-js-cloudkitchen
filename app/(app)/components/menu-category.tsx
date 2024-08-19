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
    <Card className="w-48 rounded-2xl shadow-md p-2">
      <CardContent className="flex gap-2 pl-0 pb-0 justify-start">
        <Icon className="size-8 text-primary" />
        <div className="text-xs">
          <p className="font-semibold">{name}</p>
          <p>{shortDescription}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCategoryItem;

//Adding flexable card for responsive
