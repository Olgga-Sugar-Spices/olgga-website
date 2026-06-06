import { NextResponse } from "next/server";
import { Resend } from "resend";
import InvoiceEmail from "@/components/emails/InvoiceEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || "help@olgga.in";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customerName, customerEmail, totalAmount, items } = body;

    const currentDate = new Date().toLocaleDateString();

    // Send to Customer
    const customerResponse = await resend.emails.send({
      from: "orders@olgga.in", // Update to "orders@olgga.in" once domain is verified
      to: customerEmail, 
      subject: `Order Confirmation - Olgga #${orderId}`,
      react: (
        <InvoiceEmail
          orderId={orderId}
          customerName={customerName}
          totalAmount={totalAmount}
          date={currentDate}
          items={items}
        />
      ),
    });

    // Send to Admin
    const adminResponse = await resend.emails.send({
      from: "system@olgga.in", // Update to "system@olgga.in" once domain is verified
      to: adminEmail, 
      subject: `[New Order] ₹${totalAmount} from ${customerName}`,
      react: (
        <InvoiceEmail
          orderId={orderId}
          customerName={customerName}
          totalAmount={totalAmount}
          date={currentDate}
          items={items}
        />
      ),
    });

    return NextResponse.json({ success: true, customerResponse, adminResponse });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}