import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

//Need send verification email link and email is always async because lots of task like smtp
export async function sendVerificationEmail(
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "dev@sssss.com",
      to: email,
      subject: "Tamo cloud kitchen Verification Code",
      react: VerificationEmail({ email, otp: verifyCode }),
    });

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
