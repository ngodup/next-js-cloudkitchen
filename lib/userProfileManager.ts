import { getSession } from "next-auth/react";
import axios from "axios";

const getUserProfile = async () => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return null;
    }

    const userId = session.user._id;
    const userEmail = session.user.email;

    if (!userId && !userEmail) {
      return null;
    }

    const response = await axios.get("/api/user-profile");

    if (response.data.userProfile) {
      return response.data.userProfile;
    }

    if (userEmail) {
      const newProfileResponse = await axios.post("/api/user-profile", {
        userId: userId,
        email: userEmail,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        avatarUrl: session.user.image || "",
      });

      return newProfileResponse.data.userProfile;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export { getUserProfile };
