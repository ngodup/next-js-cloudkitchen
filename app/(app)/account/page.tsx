"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { IUserProfile, IAddress } from "@/types";

const AccountPage = () => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/profile");
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
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profileData = Object.fromEntries(formData);

    try {
      const method = userProfile ? "put" : "post";
      const response = await axios[method]("/api/user-profile", profileData);
      debugger;
      if (response.data.success) {
        // Explicitly update the state with the new profile data
        setUserProfile(response.data.userProfile);
        setIsEditing(false);
        toast({
          title: "Success",
          description: userProfile
            ? "Profile updated successfully"
            : "Profile created successfully",
        });
      } else {
        // Handle unsuccessful response
        toast({
          title: "Error",
          description: response.data.message || "Failed to save profile",
          variant: "destructive",
        });
      }
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {session && (
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userProfile?.avatarUrl || ""}
                  alt={session.user?.username || "User"}
                />
                <AvatarFallback>
                  {(session.user?.username?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {session.user.username}
                </h2>
                <p className="text-gray-500">{session.user.email}</p>
              </div>
            </div>
          )}

          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              {!isEditing ? (
                <div className="space-y-2">
                  <p>
                    <strong>First Name:</strong>{" "}
                    {userProfile?.firstName || "Not provided"}
                  </p>
                  <p>
                    <strong>Last Name:</strong>{" "}
                    {userProfile?.lastName || "Not provided"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {userProfile?.phoneNumber || "Not provided"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {userProfile?.dateOfBirth
                      ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </p>
                  <p>
                    <strong>Gender:</strong>{" "}
                    {userProfile?.gender || "Not provided"}
                  </p>
                  <Button onClick={() => setIsEditing(true)}>
                    {userProfile ? "Edit Profile" : "Create Profile"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={userProfile?.firstName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={userProfile?.lastName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      defaultValue={userProfile?.phoneNumber}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      defaultValue={
                        userProfile?.dateOfBirth?.toString().split("T")[0]
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      defaultValue={userProfile?.gender}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save Profile</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="addresses">
              {addresses.map((address) => (
                <Card key={address._id} className="mb-4">
                  <CardContent className="p-4">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p>{address.country}</p>
                  </CardContent>
                </Card>
              ))}
              <Button>Add New Address</Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={() => router.push("/orders")}>
              View My Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
