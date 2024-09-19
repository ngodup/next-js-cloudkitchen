"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfo } from "./PersonalInfo";
import { userProfileSchema } from "@/schemas/userProfileShcema";
import { ProfileHeader } from "./ProfileHeader";
import { AddressList } from "./AddressList";
import { useToastNotification } from "@/hooks/useToastNotification";
import { userProfileService } from "@/services/userProfileService";
import { addressService } from "@/services/addressService";
import AddressForm, {
  AddressFormData,
} from "@/components/checkout/AddressForm";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { successToast, errorToast } = useToastNotification();

  const {
    data: userProfile,
    error: profileError,
    mutate: mutateProfile,
    isLoading: isProfileLoading,
  } = useSWR("userProfile", userProfileService.getUserProfile, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onSuccess: (data) => console.log("SWR success, userProfile:", data),
    onError: (error) => {
      console.error("SWR Error:", error);
      errorToast("Error", "Failed to fetch user profile. Please try again.");
    },
  });

  const {
    data: addresses,
    error: addressesError,
    mutate: mutateAddresses,
    isLoading: isAddressesLoading,
  } = useSWR("addresses", addressService.fetchAddresses);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (profileError) {
      errorToast("Error", "Failed to fetch user profile");
    }
    if (addressesError) {
      errorToast("Error", "Failed to fetch addresses");
    }
  }, [profileError, addressesError, errorToast]);

  const handleProfileSubmit = async (
    data: z.infer<typeof userProfileSchema>
  ) => {
    try {
      const updatedProfile = await userProfileService.updateUserProfile(data);
      await mutateProfile(updatedProfile);
      setIsEditing(false);
      successToast("User Profile", "updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      errorToast("Error", "Failed to save profile");
    }
  };

  const handleAddNewAddress = async (data: AddressFormData) => {
    try {
      const newAddress = await addressService.addAddress(data);
      await mutateAddresses();
      setIsAddingAddress(false);
      successToast("Address", "New address added successfully");
    } catch (error) {
      console.error("Error adding new address:", error);
      errorToast("Error", "Failed to add new address");
    }
  };

  if (status === "loading" || isProfileLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/sign-in?redirect=/account");
    return null;
  }

  if (profileError) {
    return (
      <div className="container mx-auto p-4">
        <h2>Error loading profile</h2>
        <p>Details: {profileError.message || "Unknown error"}</p>
        <Button onClick={() => mutateProfile()}>Retry</Button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto p-4">
        <h2>No profile found</h2>
        <p>We couldn&apos;t find your profile. You may need to create one.</p>
        <Button onClick={() => setIsEditing(true)}>Create Profile</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-8xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileHeader userProfile={userProfile} />
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardContent className="pt-6">
              <PersonalInfo
                userProfile={userProfile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSubmit={handleProfileSubmit}
                onCancel={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardContent className="pt-6">
              {isAddingAddress ? (
                <AddressForm
                  onSubmit={handleAddNewAddress}
                  onCancel={() => setIsAddingAddress(false)}
                />
              ) : (
                <>
                  <AddressList addresses={addresses || []} />
                  <div className="text-right">
                    <Button
                      className="mt-4 text-right"
                      onClick={() => setIsAddingAddress(true)}
                    >
                      Add New Address
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-right">
        <Button onClick={() => router.push("/orders")} size="lg">
          View My Orders
        </Button>
      </div>
    </div>
  );
};

export default Account;
