/**
 * DESIGN SYSTEM EXAMPLE COMPONENT
 * Demonstrates how to use the centralized design system
 * This file shows best practices for using colors, typography, spacing, and icons
 */

'use client';

import React from 'react';
import { theme } from '@/core/config/theme';
import {
    HomeIcon,
    CheckCircleIcon,
    WarningIcon,
    ErrorIcon,
    CalculateIcon,
    TrophyIcon,
    TrendingUpIcon,
} from '@/components/icons';

export default function DesignSystemExample() {
    return (
        <div className="min-h-screen bg-primary p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <header className="text-center space-y-4">
                    <h1 className="text-primary">
                        Project Atlas Design System
                    </h1>
                    <p className="text-secondary text-lg">
                        Centralized design tokens for consistent UI development
                    </p>
                </header>

                {/* Color Palette Section */}
                <section className="bg-secondary rounded-[var(--radius-xl)] p-6 space-y-4">
                    <h2 className="text-primary">Color Palette</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Background Colors */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-secondary">Backgrounds</h3>
                            <div className="space-y-2">
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-primary))]" />
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]" />
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--bg-tertiary))]" />
                            </div>
                        </div>

                        {/* Accent Colors */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-secondary">Accents</h3>
                            <div className="space-y-2">
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--accent-primary))]" />
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--accent-secondary))]" />
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--accent-danger))]" />
                            </div>
                        </div>

                        {/* Status Colors */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-secondary">Status</h3>
                            <div className="space-y-2">
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--status-success))]" />
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--status-warning))]" />
                                <div className="h-12 rounded-[var(--radius-md)] bg-[hsl(var(--status-error))]" />
                            </div>
                        </div>

                        {/* Text Colors */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-secondary">Text</h3>
                            <div className="space-y-2 bg-[hsl(var(--bg-primary))] p-3 rounded-[var(--radius-md)]">
                                <p className="text-primary text-sm">Primary Text</p>
                                <p className="text-secondary text-sm">Secondary Text</p>
                                <p className="text-tertiary text-sm">Tertiary Text</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography Section */}
                <section className="bg-secondary rounded-[var(--radius-xl)] p-6 space-y-4">
                    <h2 className="text-primary">Typography Scale</h2>

                    <div className="space-y-3">
                        <div className="text-[length:var(--text-5xl)] font-[var(--font-bold)] text-primary">
                            Hero Text (48px)
                        </div>
                        <div className="text-[length:var(--text-4xl)] font-[var(--font-bold)] text-primary">
                            Heading 1 (36px)
                        </div>
                        <div className="text-[length:var(--text-3xl)] font-[var(--font-semibold)] text-primary">
                            Heading 2 (30px)
                        </div>
                        <div className="text-[length:var(--text-2xl)] font-[var(--font-semibold)] text-secondary">
                            Heading 3 (24px)
                        </div>
                        <div className="text-[length:var(--text-xl)] font-[var(--font-medium)] text-secondary">
                            Heading 4 (20px)
                        </div>
                        <div className="text-[length:var(--text-base)] font-[var(--font-normal)] text-tertiary">
                            Body Text (16px) - This is the default text size for body content
                        </div>
                        <div className="text-[length:var(--text-sm)] text-tertiary">
                            Small Text (14px) - Used for captions and secondary information
                        </div>
                    </div>
                </section>

                {/* Icons Section */}
                <section className="bg-secondary rounded-[var(--radius-xl)] p-6 space-y-4">
                    <h2 className="text-primary">Icon System</h2>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <HomeIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-primary))' }} />
                            <span className="text-xs text-tertiary">Home</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <CalculateIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-primary))' }} />
                            <span className="text-xs text-tertiary">Calculate</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <TrophyIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-warning))' }} />
                            <span className="text-xs text-tertiary">Trophy</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <TrendingUpIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-secondary))' }} />
                            <span className="text-xs text-tertiary">Trending</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircleIcon sx={{ fontSize: '2rem', color: 'hsl(var(--status-success))' }} />
                            <span className="text-xs text-tertiary">Success</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <WarningIcon sx={{ fontSize: '2rem', color: 'hsl(var(--status-warning))' }} />
                            <span className="text-xs text-tertiary">Warning</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ErrorIcon sx={{ fontSize: '2rem', color: 'hsl(var(--status-error))' }} />
                            <span className="text-xs text-tertiary">Error</span>
                        </div>
                    </div>
                </section>

                {/* Component Examples */}
                <section className="bg-secondary rounded-[var(--radius-xl)] p-6 space-y-4">
                    <h2 className="text-primary">Component Examples</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Button Examples */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-secondary">Buttons</h3>
                            <button className="px-[var(--space-4)] py-[var(--space-2)] bg-[hsl(var(--accent-primary))] text-[hsl(var(--text-primary))] rounded-[var(--radius-md)] font-[var(--font-medium)] hover:bg-[hsl(var(--accent-primary-hover))] transition-[var(--transition-base)]">
                                Primary Button
                            </button>
                            <button className="px-[var(--space-4)] py-[var(--space-2)] bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-primary))] rounded-[var(--radius-md)] font-[var(--font-medium)] border border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--bg-elevated))] transition-[var(--transition-base)]">
                                Secondary Button
                            </button>
                        </div>

                        {/* Card Example */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-secondary">Card</h3>
                            <div className="bg-[hsl(var(--bg-tertiary))] rounded-[var(--radius-lg)] p-[var(--space-4)] border border-[hsl(var(--border-primary))] shadow-[var(--shadow-md)]">
                                <h4 className="text-[length:var(--text-lg)] font-[var(--font-semibold)] text-primary mb-[var(--space-2)]">
                                    Card Title
                                </h4>
                                <p className="text-secondary text-[length:var(--text-sm)]">
                                    This is an example card using the design system variables.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Usage Guide */}
                <section className="bg-secondary rounded-[var(--radius-xl)] p-6 space-y-4">
                    <h2 className="text-primary">Usage Guide</h2>

                    <div className="space-y-4 text-secondary">
                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">CSS Variables</h3>
                            <code className="block bg-[hsl(var(--code-bg))] p-4 rounded-[var(--radius-md)] text-sm">
                                {`/* Use CSS variables in Tailwind classes */\n`}
                                {`<div className="bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))]">\n`}
                                {`  <h1 className="text-[length:var(--text-4xl)] font-[var(--font-bold)]">\n`}
                                {`    Hello World\n`}
                                {`  </h1>\n`}
                                {`</div>`}
                            </code>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">TypeScript Theme</h3>
                            <code className="block bg-[hsl(var(--code-bg))] p-4 rounded-[var(--radius-md)] text-sm">
                                {`import { theme } from '@/core/config/theme';\n\n`}
                                {`// Access theme values in TypeScript\n`}
                                {`const primaryColor = theme.colors.accent.primary;\n`}
                                {`const fontSize = theme.typography.fontSize.lg;`}
                            </code>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Icons</h3>
                            <code className="block bg-[hsl(var(--code-bg))] p-4 rounded-[var(--radius-md)] text-sm">
                                {`import { HomeIcon, CheckCircleIcon } from '@/components/icons';\n\n`}
                                {`<HomeIcon sx={{ fontSize: '2rem', color: 'hsl(var(--accent-primary))' }} />`}
                            </code>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
