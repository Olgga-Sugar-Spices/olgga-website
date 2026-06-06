import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  orderId: string;
  customerName: string;
  totalAmount: number;
  date: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export default function InvoiceEmail({
  orderId,
  customerName,
  totalAmount,
  date,
  items,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Olgga Order Invoice #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Olgga Sugar & Spices</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your order! Your payment was successful, and we are now processing your items.
          </Text>

          <Section style={invoiceBox}>
            <Text style={invoiceHeading}>Order Summary</Text>
            <Text style={text}><strong>Order ID:</strong> {orderId}</Text>
            <Text style={text}><strong>Date:</strong> {date}</Text>
            <Hr style={hr} />
            
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <Text style={text}>{item.quantity}x {item.name}</Text>
                <Text style={text}>₹{item.price * item.quantity}</Text>
              </div>
            ))}
            
            <Hr style={hr} />
            <div style={itemRow}>
              <Text style={totalText}>Total Amount</Text>
              <Text style={totalText}>₹{totalAmount}</Text>
            </div>
          </Section>

          <Text style={footer}>
            If you have any questions, reply to this email or contact us at help@olgga.in.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "40px 20px", borderRadius: "8px", maxWidth: "600px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", textAlign: "center" as const, margin: "0 0 20px" };
const text = { color: "#555", fontSize: "16px", margin: "10px 0" };
const invoiceBox = { border: "1px solid #eee", borderRadius: "8px", padding: "20px", margin: "20px 0" };
const invoiceHeading = { fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 10px" };
const itemRow = { display: "flex", justifyContent: "space-between", margin: "5px 0" };
const hr = { borderColor: "#eee", margin: "15px 0" };
const totalText = { fontSize: "18px", fontWeight: "bold", color: "#EAB308" };
const footer = { color: "#888", fontSize: "14px", textAlign: "center" as const, marginTop: "30px" };