import Image from "next/image";
import Link from "next/link";
import { Mail, ExternalLink, Shield, FileText } from "lucide-react";

const links = [
  { href: "/",          label: "Home" },
  { href: "/login",     label: "Login" },
  { href: "/sop",       label: "How to Create" },
  { href: "/submit",    label: "Submit Video" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mb-16 md:mb-0">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white rounded-lg px-2 py-1">
                <Image
                  src="/testbook-logo.png"
                  alt="Testbook"
                  width={4500}
                  height={913}
                  className="h-6 w-auto"
                />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: "#f97316" }}>Creator</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Testbook&apos;s official student creator campaign — earn by promoting Testbook Pass through short videos.
            </p>
            <a href="mailto:creator-support@testbook.com"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <Mail size={14} /> creator-support@testbook.com
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Campaign</h4>
            <ul className="space-y-2.5">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://testbook.com/terms" target="_blank" rel="noreferrer"
                  className="text-sm hover:text-white transition-colors inline-flex items-center gap-1">
                  <FileText size={12} /> Terms of Service <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a href="https://testbook.com/privacy" target="_blank" rel="noreferrer"
                  className="text-sm hover:text-white transition-colors inline-flex items-center gap-1">
                  <Shield size={12} /> Privacy Policy <ExternalLink size={10} />
                </a>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-slate-800 rounded-xl text-xs">
              <p className="text-slate-300 font-semibold mb-1">Campaign Domain</p>
              <p className="text-blue-400 font-mono">ugc.testbook.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© 2025 Testbook.com. All rights reserved.</p>
          <p>Made with ❤ for India&apos;s exam warriors</p>
        </div>
      </div>
    </footer>
  );
}
