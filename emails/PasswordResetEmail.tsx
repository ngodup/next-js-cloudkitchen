import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetUrl,
}) => (
  <Html>
    <Head />
    <Preview>Reset your password for Tamo Cloud Kitchen</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for your Tamo Cloud
          Kitchen account. Click the button below to reset it:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t request this, you can safely ignore this email.
          Your password will remain unchanged.
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles...
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "1.25",
  textAlign: "center" as const,
  margin: "0 0 15px",
};

const text = {
  color: "#333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#22c55e",
  borderRadius: "5px",
  color: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

export default PasswordResetEmail;
