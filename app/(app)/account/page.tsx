"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { IUserProfile, IAddress } from "@/types";
import { PersonalInfo } from "./PersonalInfo";
import { userProfileSchema } from "@/schemas/userProfileShcema";
import { ProfileHeader } from "./ProfileHeader";
import { AddressList } from "./AddressList";

const AccountPage = () => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/account");
    } else if (status === "authenticated") {
      fetchUserProfile();
      fetchAddresses();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/user-profile");
      if (response.data.success && response.data.userProfile) {
        setUserProfile(response.data.userProfile);
      } else {
        setUserProfile(null);
        console.log("No user profile found or error in fetching");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/api/addresses");
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive",
      });
    }
  };

  const handleProfileSubmit = async (
    data: z.infer<typeof userProfileSchema>
  ) => {
    try {
      const method = userProfile ? "put" : "post";
      const response = await axios[method]("/api/user-profile", data);

      setUserProfile(response.data.userProfile);
      setIsEditing(false);

      setUserProfile(response.data.userProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: userProfile
          ? "Profile updated successfully"
          : "Profile created successfully",
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

  if (status === "loading") {
    return <div className="container mx-auto p-4">Loading...</div>;
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
              <AddressList addresses={addresses} />
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

export default AccountPage;
