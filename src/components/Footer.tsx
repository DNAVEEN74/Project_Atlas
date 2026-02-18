import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="py-10 px-6 bg-[#0a0a0a] border-t border-neutral-900/50 text-neutral-500 text-sm">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 opacity-60">
                    <Image src="/logo-final.png" alt="PrepLeague Logo" width={20} height={20} />
                    <span>© 2026 PrepLeague</span>
                </div>
                <div className="flex gap-6">
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}
