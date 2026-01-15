/**
 * PREPLEAGUE - THEME CONFIGURATION
 * Centralized theme values for TypeScript usage
 * Mirrors the CSS variables defined in globals.css
 */

export const theme = {
    // ========== COLORS ==========
    colors: {
        // Background Colors
        background: {
            primary: 'hsl(222, 47%, 11%)',      // #1a1f2e
            secondary: 'hsl(220, 39%, 15%)',    // #252d3d
            tertiary: 'hsl(218, 33%, 19%)',     // #303947
            elevated: 'hsl(220, 39%, 18%)',     // #2a3241
            overlay: 'hsl(222, 47%, 8%)',       // #0f1419
        },

        // Text Colors
        text: {
            primary: 'hsl(210, 20%, 98%)',      // #f8f9fa
            secondary: 'hsl(214, 15%, 75%)',    // #b8bdc4
            tertiary: 'hsl(215, 14%, 55%)',     // #7d8590
            disabled: 'hsl(215, 12%, 40%)',     // #5a6169
            inverse: 'hsl(222, 47%, 11%)',      // #1a1f2e
        },

        // Accent Colors
        accent: {
            primary: 'hsl(210, 100%, 60%)',     // #3399ff
            primaryHover: 'hsl(210, 100%, 55%)', // #1a8cff
            secondary: 'hsl(142, 71%, 45%)',    // #22c55e
            warning: 'hsl(38, 92%, 50%)',       // #f59e0b
            danger: 'hsl(0, 84%, 60%)',         // #ef4444
            info: 'hsl(199, 89%, 48%)',         // #0ea5e9
            purple: 'hsl(271, 81%, 56%)',       // #a855f7
        },

        // Border Colors
        border: {
            primary: 'hsl(217, 19%, 27%)',      // #3d4450
            secondary: 'hsl(215, 16%, 22%)',    // #30363d
            focus: 'hsl(210, 100%, 60%)',       // #3399ff
            error: 'hsl(0, 84%, 60%)',          // #ef4444
        },

        // Status Colors
        status: {
            success: 'hsl(142, 71%, 45%)',      // #22c55e
            error: 'hsl(0, 84%, 60%)',          // #ef4444
            warning: 'hsl(38, 92%, 50%)',       // #f59e0b
            info: 'hsl(199, 89%, 48%)',         // #0ea5e9
        },

        // Code/Syntax Colors
        code: {
            bg: 'hsl(222, 47%, 8%)',            // #0f1419
            keyword: 'hsl(271, 81%, 56%)',      // #a855f7
            string: 'hsl(142, 71%, 45%)',       // #22c55e
            number: 'hsl(38, 92%, 50%)',        // #f59e0b
            comment: 'hsl(215, 14%, 55%)',      // #7d8590
        },
    },

    // ========== TYPOGRAPHY ==========
    typography: {
        // Font Families
        fontFamily: {
            primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
            mono: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
        },

        // Font Sizes (in rem)
        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '1.875rem',  // 30px
            '4xl': '2.25rem',   // 36px
            '5xl': '3rem',      // 48px
        },

        // Font Weights
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },

        // Line Heights
        lineHeight: {
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
        },
    },

    // ========== SPACING ==========
    spacing: {
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
    },

    // ========== BORDER RADIUS ==========
    borderRadius: {
        sm: '0.25rem',    // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        full: '9999px',   // Fully rounded
    },

    // ========== SHADOWS ==========
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },

    // ========== Z-INDEX ==========
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modalBackdrop: 1300,
        modal: 1400,
        popover: 1500,
        tooltip: 1600,
    },

    // ========== TRANSITIONS ==========
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // ========== LAYOUT ==========
    layout: {
        containerMaxWidth: '1280px',
        sidebarWidth: '280px',
        headerHeight: '64px',
    },
} as const;

// Type exports for TypeScript autocomplete
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeTypography = typeof theme.typography;
export type ThemeSpacing = typeof theme.spacing;
