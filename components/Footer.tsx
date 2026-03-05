import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#000000] to-[#2C2C2C] text-yellow-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
                O
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Olgga</h3>
                <p className="text-sm text-yellow-300">Sugar & Spices</p>
              </div>
            </div>

            <p className="text-sm text-yellow-200 leading-relaxed max-w-sm">
              Bringing the finest quality spices and sugars from India&apos;s
              heartland to your kitchen. Sourced directly from farmers,
              processed with care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-yellow-300 text-sm">
              <li className="hover:text-white cursor-pointer"><Link href = "/" scroll={true}>Home</Link></li>
              <li className="hover:text-white cursor-pointer"><Link href = "/shop/dryfruits">Dry Fruits</Link></li>
              <li className="hover:text-white cursor-pointer"><Link href = "/shop/spices">Spices</Link></li>
              <li className="hover:text-white cursor-pointer"><Link href = "/shop/spice-blends">Spice Blends</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-3 text-yellow-300 text-sm">
              <li className="hover:text-white cursor-pointer">Track Order</li>
              <li className="hover:text-white cursor-pointer"><Link href="/returns">Returns & Refunds</Link></li>
              <li className="hover:text-white cursor-pointer">Shipping Policy</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Contact Us
            </h4>

            <ul className="space-y-4 text-sm text-yellow-300">
              <li className="flex items-center gap-3">
                <Phone size={16} />
                +91 9310195305
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} />
                help.olgga@gmail.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1" />
                <span>
                  H-847, Raj Nagar Ext. II <br />
                  New Delhi, Delhi 110077
                </span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-600 transition"
              >
                <Facebook size={18} className="text-white" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-600 transition"
              >
                <Instagram size={18} className="text-white" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-600 transition"
              >
                <Twitter size={18} className="text-white" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-200/20 mt-12 pt-6 text-center text-sm text-yellow-300">
          © {new Date().getFullYear()} Olgga Sugar & Spices. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
