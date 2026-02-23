export default function ReturnsPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20 text-gray-300">

        <h1 className="text-4xl font-bold mb-6 text-yellow-300">
          Returns & Refunds Policy
        </h1>

        <p className="mb-10 text-gray-400">
          Last updated: February 23rd, 2026
        </p>

        {/* INTRO */}
        <p className="mb-8 leading-relaxed">
          At <span className="text-yellow-400 font-semibold">Olgga Sugar & Spices</span>, 
          we want you to be completely satisfied with your purchase. If you are 
          not fully happy with your order, you may request a return or refund 
          under the terms outlined below.
        </p>

        {/* 1 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          1. Return Eligibility
        </h2>

        <p className="mb-4 leading-relaxed">
          You may request a return within <span className="text-yellow-400">7 days </span> 
          of delivery if:
        </p>

        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-400">
          <li>The item is unused and in original condition</li>
          <li>The item is in original packaging</li>
          <li>You have valid proof of purchase</li>
        </ul>

        <p className="mb-6 text-gray-400">
          Items damaged due to misuse, mishandling, or improper storage 
          will not be eligible for return.
        </p>

        {/* 2 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          2. Non-Returnable Items
        </h2>

        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-400">
          <li>Used or opened products</li>
          <li>Customized or personalized products</li>
          <li>Items purchased during clearance or final sale</li>
        </ul>

        {/* 3 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          3. Refund Process
        </h2>

        <p className="mb-4 text-gray-400 leading-relaxed">
          Once we receive and inspect your returned item:
        </p>

        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-400">
          <li>Approved refunds will be processed within 5–7 business days</li>
          <li>Refunds will be issued to your original payment method</li>
          <li>Bank processing times may vary depending on your provider</li>
        </ul>

        {/* 4 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          4. Shipping Costs
        </h2>

        <p className="mb-6 text-gray-400 leading-relaxed">
          Return shipping costs are the responsibility of the customer unless 
          the product received was defective or incorrect. Original shipping 
          charges are non-refundable.
        </p>

        {/* 5 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          5. Damaged or Incorrect Products
        </h2>

        <p className="mb-6 text-gray-400 leading-relaxed">
          If you receive a damaged or incorrect item, please contact us within 
          <span className="text-yellow-400"> 48 hours </span>
          of delivery and include clear photos of the product and packaging.
        </p>

        {/* 6 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          6. How to Request a Return
        </h2>

        <p className="mb-4 text-gray-400 leading-relaxed">
          To request a return, please email us at:
        </p>

        <p className="mb-4 text-yellow-400 font-semibold">
          help@olgga.in
        </p>

        <p className="mb-4 text-gray-400">
          Please include the following details:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>Order number</li>
          <li>Product name</li>
          <li>Reason for return</li>
          <li>Photos (if applicable)</li>
        </ul>

      </div>
    </div>
  );
}