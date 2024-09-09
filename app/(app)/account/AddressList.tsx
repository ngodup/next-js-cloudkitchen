import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IAddress } from "@/types";

interface AddressListProps {
  addresses: IAddress[];
}

export function AddressList({ addresses }: AddressListProps) {
  if (!addresses || addresses.length === 0) {
    return <Card>No addresses found.</Card>;
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address._id} className="mb-4">
          <CardContent className="p-4">
            <p className="font-semibold">{address.street}</p>
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
            <p>{address.country}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
