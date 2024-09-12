"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfo } from "./PersonalInfo";
import { userProfileSchema } from "@/schemas/userProfileShcema";
import { ProfileHeader } from "./ProfileHeader";
import { AddressList } from "./AddressList";
import { getUserProfile } from "@/lib/userProfileManager";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: userProfile,
    error: profileError,
    mutate: mutateProfile,
    isLoading: isProfileLoading,
  } = useSWR("userProfile", getUserProfile, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onSuccess: (data) => console.log("SWR success, userProfile:", data),
    onError: (error) => {
      console.error("SWR Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("Session authenticated, triggering profile mutate");
      mutateProfile();
    }
  }, [status, session, mutateProfile]);

  const {
    data: addresses,
    error: addressesError,
    mutate: mutateAddresses,
    isLoading: isAddressesLoading,
  } = useSWR("/api/addresses", () =>
    axios.get("/api/addresses").then((res) => res.data.addresses)
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
    if (addressesError) {
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive",
      });
    }
  }, [profileError, addressesError, toast]);

  const handleProfileSubmit = async (
    data: z.infer<typeof userProfileSchema>
  ) => {
    try {
      const response = await axios.put("/api/user-profile", data);
      await mutateProfile(response.data.userProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
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
    console.error("Profile error:", profileError);
    return (
      <div className="container mx-auto p-4">
        <h2>Error loading profile</h2>
        <p>Details: {profileError.message || "Unknown error"}</p>
        <Button onClick={() => mutateProfile()}>Retry</Button>
      </div>
    );
  }

  if (!userProfile) {
    console.log("User profile is null");
    return (
      <div className="container mx-auto p-4">
        <h2>No profile found</h2>
        <p>We couldnt find your profile. You may need to create one.</p>
        <Button onClick={() => setIsEditing(true)}>Create Profile</Button>
      </div>
    );
  }

  console.log("Rendering account page with userProfile:", userProfile);

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
              <AddressList addresses={addresses || []} />
              <div className="text-right">
                <Button className="mt-4 text-right">Add New Address</Button>
              </div>
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
