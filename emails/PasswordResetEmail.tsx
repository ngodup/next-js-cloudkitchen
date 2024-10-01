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
    <Body className="bg-gray-100 font-sans">
      <Container className="bg-white mx-auto py-5 px-0 mb-16">
        <Heading className="text-gray-800 font-bold text-2xl leading-tight text-center mb-4">
          Reset your password
        </Heading>
        <Text className="text-gray-800 text-sm leading-6 text-center">
          We received a request to reset your password for your Tamo Cloud
          Kitchen account. Click the button below to reset it:
        </Text>
        <Section className="text-center">
          <Button
            className="bg-green-500 rounded px-4 py-2 text-white font-bold text-sm no-underline text-center block w-full"
            href={resetUrl}
          >
            Reset Password
          </Button>
        </Section>
        <Text className="text-gray-800 text-sm leading-6 text-center">
          If you didn&apos;t request this, you can safely ignore this email.
          Your password will remain unchanged.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;
