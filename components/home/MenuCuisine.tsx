import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { MenuCuisine } from "@/types";
import { cn } from "@/lib/utils";

interface MenuCuisineProps {
  menu: MenuCuisine;
  isActive: boolean;
  onClick: () => void;
}

const MenuCuisineItem = ({ menu, isActive, onClick }: MenuCuisineProps) => {
  const { name, icon, shortDescription } = menu;
  const Icon = Icons[icon || "foodPot"];

  return (
    <Card
      className={cn(
        "w-48 rounded-2xl shadow-md p-2 cursor-pointer transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
      )}
      onClick={onClick}
    >
      <CardContent className="flex gap-2 pl-0 pb-0 justify-start">
        <Icon
          className={cn(
            "size-8",
            isActive ? "text-primary-foreground" : "text-primary"
          )}
        />
        <div className="text-xs">
          <p className="font-semibold">{name === "all" ? "Toute" : name}</p>
          <p>{shortDescription}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCuisineItem;
