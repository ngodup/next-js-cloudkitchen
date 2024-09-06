import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CategoryItem } from "@/types";

export interface CategoryProps {
  categories: CategoryItem[];
  selectedCategories: string[];
  onCategoryChange: (selectedCategories: string[]) => void;
}

const Category: React.FC<CategoryProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  const handleCategoryChange = (checked: boolean, categoryId: string) => {
    const updatedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((c) => c !== categoryId);
    onCategoryChange(updatedCategories);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">CATÉGORIE</h3>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={category.id}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) =>
              handleCategoryChange(checked as boolean, category.id)
            }
          />
          <Label htmlFor={category.id}>{category.label}</Label>
        </div>
      ))}
    </div>
  );
};

export default Category;
