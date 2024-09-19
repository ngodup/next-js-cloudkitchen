import { IAddress } from "@/types";
import { Button } from "../ui/button";

interface AddressItemProps {
  address: IAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const AddressItem = ({
  address,
  isSelected,
  onSelect,
  onEdit,
}: AddressItemProps) => {
  return (
    <div
      className={`p-4 border rounded mb-2 ${
        isSelected ? "bg-blue-100 border-blue-300" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{address.street}</p>
          <p className="text-sm text-gray-600">{`${address.city}, ${address.state} ${address.zip}`}</p>
          <p className="text-sm text-gray-600">{address.country}</p>
        </div>
        <div className="space-x-2">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={onSelect}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressItem;
