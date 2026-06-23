import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="py-20 px-6 bg-[#0f0f0f] border-t border-neutral-800/50 text-neutral-500 text-sm selection:bg-amber-500/30">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                <div className="flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
                      <div className="relative w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Image src="/logo-final.png" alt="PrepLeague Logo" fill className="object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white tracking-tight">PrepLeague</span>
                      </div>
                  </Link>
                  <p className="text-[11px] text-neutral-600 font-medium max-w-[200px] leading-relaxed">
                    Built for aspirants who prioritize elite performance. The definitive choice for CGL mastery.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest mb-1">Platform</span>
                        <Link href="/problems" className="hover:text-white transition-colors">Problem Repository</Link>
                        <Link href="/sprint" className="hover:text-white transition-colors">Sprint Training</Link>

                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest mb-1">Legal</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>

                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest mb-1">Company</span>
                        <Link href="/about" className="hover:text-white transition-colors">About Story</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Engine Support</Link>
                    </div>
                </div>
            </div>
            
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-neutral-700">
              <div className="flex items-center gap-2">
                <span>© 2018-{new Date().getFullYear()} PREPLEAGUE TECHNOLOGIES. ALL RIGHTS RESERVED.</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="hover:text-neutral-500 cursor-default transition-colors uppercase tracking-widest">v1.2.0-STABLE</span>
              </div>
            </div>
        </footer>
    );
}
