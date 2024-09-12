import { getSession } from "next-auth/react";
import axios from "axios";

const getUserProfile = async () => {
  console.log("getUserProfile function called");
  try {
    const session = await getSession();
    console.log("Session data:", session);

    if (!session || !session.user) {
      console.log("No authenticated user in session");
      return null;
    }

    const userId = session.user._id;
    const userEmail = session.user.email;

    if (!userId && !userEmail) {
      console.log("No user identifier found in session");
      return null;
    }

    console.log("Fetching user profile");
    const response = await axios.get("/api/user-profile");
    console.log("API response:", response.data);

    if (response.data.userProfile) {
      console.log(
        "Returning existing user profile:",
        response.data.userProfile
      );
      return response.data.userProfile;
    }

    console.log("No existing profile found, attempting to create one");
    if (userEmail) {
      const newProfileResponse = await axios.post("/api/user-profile", {
        userId: userId,
        email: userEmail,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        avatarUrl: session.user.image || "",
      });
      console.log("New profile created:", newProfileResponse.data.userProfile);
      return newProfileResponse.data.userProfile;
    }

    console.log("Unable to create user profile");
    return null;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

export { getUserProfile };
