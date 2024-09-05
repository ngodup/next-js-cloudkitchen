import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IUserProfile } from "@/types";
import { userProfileSchema } from "@/schemas/userProfileShcema";

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface PersonalInfoProps {
  userProfile: IUserProfile | null;
  onSubmit: (data: UserProfileFormData) => void | Promise<void>;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

export function PersonalInfo({
  userProfile,
  onSubmit,
  isEditing,
  onEdit,
  onCancel,
}: PersonalInfoProps) {
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      phoneNumber: userProfile?.phoneNumber || "",
      dateOfBirth: userProfile?.dateOfBirth
        ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: userProfile?.gender || "",
      bio: userProfile?.bio || "",
      avatarUrl: userProfile?.avatarUrl || "",
    },
  });

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <p>
          <strong>First Name:</strong>{" "}
          {userProfile?.firstName || "Not provided"}
        </p>
        <p>
          <strong>Last Name:</strong> {userProfile?.lastName || "Not provided"}
        </p>
        <p>
          <strong>Phone:</strong> {userProfile?.phoneNumber || "Not provided"}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {userProfile?.dateOfBirth
            ? new Date(userProfile.dateOfBirth).toLocaleDateString()
            : "Not provided"}
        </p>
        <p>
          <strong>Gender:</strong> {userProfile?.gender || "Not provided"}
        </p>
        <p>
          <strong>Bio:</strong> {userProfile?.bio || "Not provided"}
        </p>
        <Button onClick={onEdit}>
          {userProfile ? "Edit Profile" : "Create Profile"}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormDescription>
                Please enter a 10-digit phone number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can write up to 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">Save Profile</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
