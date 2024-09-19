import { IAddress } from "@/types";
import AddressForm, { AddressFormData } from "./AddressForm";
import { Button } from "../ui/button";
import AddressItem from "./AddressItem";

interface AddressStepProps {
  addresses: IAddress[];
  selectedAddress: IAddress | null;
  isEditingAddress: boolean;
  onAddressSelect: (address: IAddress) => void;
  onEditAddress: () => void;
  onAddressSubmit: (data: AddressFormData) => void;
  onAddressUpdate: (data: AddressFormData) => void;
  onCancelEdit: () => void;
  onContinue: () => void;
}

const AddressStep = ({
  addresses,
  selectedAddress,
  isEditingAddress,
  onAddressSelect,
  onEditAddress,
  onAddressSubmit,
  onAddressUpdate,
  onCancelEdit,
  onContinue,
}: AddressStepProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Select or Add Address</h2>
      {addresses.map((address) => (
        <AddressItem
          key={address._id}
          address={address}
          isSelected={selectedAddress?._id === address._id}
          onSelect={() => onAddressSelect(address)}
          onEdit={onEditAddress}
        />
      ))}
      {isEditingAddress ? (
        <AddressForm
          initialData={selectedAddress || undefined}
          onSubmit={selectedAddress ? onAddressUpdate : onAddressSubmit}
          onCancel={onCancelEdit}
        />
      ) : (
        <div className="mt-4 space-x-4">
          <Button onClick={onEditAddress}>
            {addresses.length > 0 ? "Add New Address" : "Add Address"}
          </Button>
          {selectedAddress && (
            <Button onClick={onContinue}>Continue to Payment</Button>
          )}
        </div>
      )}
    </>
  );
};

export default AddressStep;
