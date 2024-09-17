import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IFoodItem } from "@/types";

interface EditFoodItemModalProps {
  foodItem: IFoodItem;
  onClose: () => void;
  onEdit: (foodItem: IFoodItem) => void;
}

const cuisines = [
  "Indienne",
  "Français",
  "Japonaise",
  "Italienne",
  "Tibétaine",
  "Vietnamienne",
];

const EditFoodItemModal: React.FC<EditFoodItemModalProps> = ({
  foodItem,
  onClose,
  onEdit,
}) => {
  const [name, setName] = useState(foodItem.name);
  const [imageName, setImageName] = useState(foodItem.imageName);
  const [price, setPrice] = useState(foodItem.price.toString());
  const [cuisine, setCuisine] = useState(foodItem.cuisine);
  const [repas, setRepas] = useState(foodItem.repas);
  const [repasType, setRepasType] = useState(foodItem.repasType);
  const [rating, setRating] = useState(foodItem.rating?.toString() || "");
  const [reviews, setReviews] = useState(foodItem.reviews?.toString() || "");
  const [active, setActive] = useState(foodItem.isActive);
  const [description, setDescription] = useState(foodItem.description || "");

  useEffect(() => {
    setName(foodItem.name);
    setImageName(foodItem.imageName);
    setPrice(foodItem.price.toString());
    setCuisine(foodItem.cuisine);
    setRepas(foodItem.repas);
    setRepasType(foodItem.repasType);
    setRating(foodItem.rating?.toString() || "");
    setReviews(foodItem.reviews?.toString() || "");
    setActive(foodItem.isActive);
    setDescription(foodItem.description || "");
  }, [foodItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      ...foodItem,
      name,
      imageName,
      price: parseFloat(price),
      cuisine,
      repas,
      repasType,
      rating: rating ? parseFloat(rating) : undefined,
      reviews: reviews ? parseInt(reviews) : undefined,
      isActive: active,
      description: description || undefined,
    });
  };

  // Function to find the matching cuisine (case-insensitive)
  const findMatchingCuisine = (value: string) => {
    return (
      cuisines.find((c) => c.toLowerCase() === value.toLowerCase()) || value
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Food Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Food Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Image Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <Select
            value={findMatchingCuisine(cuisine)}
            onValueChange={setCuisine}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisines.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Repas"
            value={repas}
            onChange={(e) => setRepas(e.target.value)}
            required
          />
          <Input
            placeholder="Repas Type"
            value={repasType}
            onChange={(e) => setRepasType(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
            step="0.1"
          />
          <Input
            type="number"
            placeholder="Reviews"
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
            min="0"
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active">Active</Label>
          </div>
          <Button type="submit">Update Food Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodItemModal;
