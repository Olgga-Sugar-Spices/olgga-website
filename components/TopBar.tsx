export default function TopBar() {
  return (
    <div className="bg-black text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1">
          
          <p className="text-center sm:text-left break-words">
            🌿 Premium Quality Spices & Sugars 
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline">
              Free shipping on orders above ₹500
            </span>
          </p>

          <p className="text-center sm:text-right">
            📞 +91 93101 95305
          </p>

        </div>

      </div>
    </div>
  );
}