import { resend } from "./resend";
import EmailVarification from "./emailTemplates/EmailVerification";

export async function sendVerificationEmail(email: string,username: string, otp: string) {
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verification code from Taska',
        react: EmailVarification({ username, otp }),        
});
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}