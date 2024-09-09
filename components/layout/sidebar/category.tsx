import React, { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ICuisineItem } from "@/types";

export interface CategoryProps {
  categories: ICuisineItem[];
  selectedCategories: string[];
  onCategoryChange: (selectedCategories: string[]) => void;
}

const Category: React.FC<CategoryProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  const [localSelectedCategories, setLocalSelectedCategories] =
    useState<string[]>(selectedCategories);

  useEffect(() => {
    setLocalSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryChange = useCallback(
    (checked: boolean, categoryId: string) => {
      setLocalSelectedCategories((prev) => {
        const updatedCategories = checked
          ? Array.from(new Set([...prev, categoryId]))
          : prev.filter((c) => c !== categoryId);

        onCategoryChange(updatedCategories);
        return updatedCategories;
      });
    },
    [onCategoryChange]
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">CUISINE</h3>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={category.id}
            checked={localSelectedCategories.includes(category.id)}
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

export default React.memo(Category);
