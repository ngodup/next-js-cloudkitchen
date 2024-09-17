import React, { useState } from "react";
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

interface AddFoodItemModalProps {
  onClose: () => void;
  onAdd: (foodItem: Omit<IFoodItem, "_id">) => void;
}

const AddFoodItemModal: React.FC<AddFoodItemModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [imageName, setImageName] = useState("");
  const [price, setPrice] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [repas, setRepas] = useState("");
  const [repasType, setRepasType] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      imageName,
      price: parseFloat(price),
      cuisine,
      repas,
      repasType,
      description,
      active,
      rating: 0, // Default rating for new items
      reviews: 0, // Default reviews count for new items
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Food Item</DialogTitle>
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
          <Select value={cuisine} onValueChange={setCuisine} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Indienne",
                "Française",
                "Japonaise",
                "Italienne",
                "Tibétaine",
                "Vietnamienne",
              ].map((c) => (
                <SelectItem key={c} value={c.toLowerCase()}>
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
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active">Active</Label>
          </div>
          <Button type="submit">Add Food Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodItemModal;
