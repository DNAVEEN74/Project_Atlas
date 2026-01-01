import Link from 'next/link';
import { HomeIcon, SchoolIcon, CalculateIcon } from '@/components/icons';

export default function Home() {
  return (
    <main className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-[length:var(--text-5xl)] font-[var(--font-bold)] text-primary">
            Project Atlas
          </h1>
          <p className="text-[length:var(--text-xl)] text-secondary">
            Quantitative Aptitude Learning Platform
          </p>
          <p className="text-tertiary max-w-2xl mx-auto">
            Master quantitative aptitude with personalized learning, adaptive practice, and intelligent mistake tracking.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Design System Link */}
          <Link href="/design-system-example">
            <div className="bg-secondary rounded-[var(--radius-xl)] p-6 border border-[hsl(var(--border-primary))] hover:bg-tertiary transition-[var(--transition-base)] cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-4">
                <HomeIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-primary))' }} />
                <h2 className="text-[length:var(--text-2xl)] font-[var(--font-semibold)] text-primary">
                  Design System
                </h2>
              </div>
              <p className="text-secondary text-[length:var(--text-sm)]">
                View the complete design system with colors, typography, icons, and components.
              </p>
            </div>
          </Link>

          {/* Practice Link (Coming Soon) */}
          <div className="bg-secondary rounded-[var(--radius-xl)] p-6 border border-[hsl(var(--border-primary))] opacity-60 h-full">
            <div className="flex items-center gap-3 mb-4">
              <CalculateIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-secondary))' }} />
              <h2 className="text-[length:var(--text-2xl)] font-[var(--font-semibold)] text-primary">
                Practice
              </h2>
            </div>
            <p className="text-secondary text-[length:var(--text-sm)]">
              Adaptive practice sessions with intelligent difficulty adjustment.
            </p>
            <span className="inline-block mt-3 text-[length:var(--text-xs)] text-tertiary bg-[hsl(var(--bg-tertiary))] px-3 py-1 rounded-[var(--radius-full)]">
              Coming Soon
            </span>
          </div>

          {/* Learn Link (Coming Soon) */}
          <div className="bg-secondary rounded-[var(--radius-xl)] p-6 border border-[hsl(var(--border-primary))] opacity-60 h-full">
            <div className="flex items-center gap-3 mb-4">
              <SchoolIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-purple))' }} />
              <h2 className="text-[length:var(--text-2xl)] font-[var(--font-semibold)] text-primary">
                Learn
              </h2>
            </div>
            <p className="text-secondary text-[length:var(--text-sm)]">
              Comprehensive lessons and tricks for all quantitative aptitude topics.
            </p>
            <span className="inline-block mt-3 text-[length:var(--text-xs)] text-tertiary bg-[hsl(var(--bg-tertiary))] px-3 py-1 rounded-[var(--radius-full)]">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary px-6 py-3 rounded-[var(--radius-lg)] border border-[hsl(var(--border-primary))]">
            <div className="w-2 h-2 bg-[hsl(var(--status-success))] rounded-full animate-pulse"></div>
            <span className="text-secondary text-[length:var(--text-sm)]">
              Architecture Ready • Design System Active
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
