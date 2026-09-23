import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pura Vitrine • Marketing para Salões | Plataforma IA",
  description: "Plataforma inteligente de marketing digital e inteligência artificial para salões de beleza de alto padrão.",
  keywords: ["marketing digital", "salão de beleza", "pura vitrine", "instagram", "estética", "campinas"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        {/* Tailwind CDN configured with Stitch Design System Tokens */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      outline: "#847372",
                      "on-surface-variant": "#524342",
                      "surface-dim": "#dfd8dc",
                      "surface-bright": "#fff7fb",
                      "primary-fixed": "#ffdad7",
                      "surface-container-low": "#f9f2f6",
                      "on-tertiary-fixed-variant": "#6b3835",
                      "surface-variant": "#e8e0e4",
                      "on-tertiary-fixed": "#360e0d",
                      "on-primary-fixed-variant": "#693936",
                      "primary-fixed-dim": "#fab6b0",
                      "on-secondary-container": "#785a1a",
                      "surface-tint": "#85504c",
                      "on-tertiary-container": "#512422",
                      "surface-container-highest": "#e8e0e4",
                      "secondary-fixed-dim": "#e9c176",
                      "secondary-container": "#fed488",
                      "on-surface": "#1d1b1e",
                      tertiary: "#874f4c",
                      "inverse-on-surface": "#f6eff3",
                      "on-tertiary": "#ffffff",
                      "on-primary-fixed": "#350f0e",
                      error: "#ba1a1a",
                      primary: "#85504c",
                      background: "#fff7fb",
                      secondary: "#775a19",
                      "tertiary-fixed": "#ffdad7",
                      "on-secondary-fixed-variant": "#5d4201",
                      "on-primary": "#ffffff",
                      "on-secondary-fixed": "#261900",
                      "on-error": "#ffffff",
                      "on-error-container": "#93000a",
                      "on-background": "#1d1b1e",
                      "inverse-primary": "#fab6b0",
                      "inverse-surface": "#332f32",
                      "error-container": "#ffdad6",
                      "on-primary-container": "#502522",
                      "on-secondary": "#ffffff",
                      "outline-variant": "#d6c2c0",
                      "tertiary-fixed-dim": "#fcb5af",
                      "tertiary-container": "#ca8984",
                      "primary-container": "#c88a85",
                      "surface-container": "#f3ecf0",
                      "secondary-fixed": "#ffdea5",
                      "surface-container-lowest": "#ffffff",
                      "surface-container-high": "#ede6ea",
                      surface: "#fff7fb"
                    },
                    borderRadius: {
                      DEFAULT: "0.25rem",
                      lg: "0.5rem",
                      xl: "0.75rem",
                      "2xl": "1rem",
                      full: "9999px"
                    },
                    spacing: {
                      "space-md": "1.25rem",
                      margin: "2rem",
                      "space-lg": "2rem",
                      "space-sm": "0.75rem",
                      "space-xs": "0.375rem",
                      "space-xl": "3rem",
                      "margin-sm": "1rem",
                      gutter: "1.5rem",
                      "gutter-sm": "1rem"
                    },
                    fontFamily: {
                      "body-sm": ["Plus Jakarta Sans", "sans-serif"],
                      "label-md": ["Plus Jakarta Sans", "sans-serif"],
                      "headline-lg": ["Playfair Display", "serif"],
                      "title-md": ["Plus Jakarta Sans", "sans-serif"],
                      "headline-xl-mobile": ["Playfair Display", "serif"],
                      "body-md": ["Plus Jakarta Sans", "sans-serif"],
                      "headline-sm": ["Playfair Display", "serif"],
                      "headline-lg-mobile": ["Playfair Display", "serif"],
                      "title-lg": ["Plus Jakarta Sans", "sans-serif"],
                      "headline-xl": ["Playfair Display", "serif"],
                      "label-lg": ["Plus Jakarta Sans", "sans-serif"],
                      "headline-md": ["Playfair Display", "serif"],
                      "body-lg": ["Plus Jakarta Sans", "sans-serif"],
                      "label-sm": ["Plus Jakarta Sans", "sans-serif"]
                    },
                    fontSize: {
                      "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
                      "label-md": ["11px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "600" }],
                      "headline-lg": ["36px", { lineHeight: "44px", letterSpacing: "-0.015em", fontWeight: "500" }],
                      "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
                      "headline-xl-mobile": ["34px", { lineHeight: "42px", letterSpacing: "-0.01em", fontWeight: "600" }],
                      "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
                      "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
                      "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "500" }],
                      "title-lg": ["18px", { lineHeight: "26px", fontWeight: "600" }],
                      "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "600" }],
                      "label-lg": ["13px", { lineHeight: "18px", letterSpacing: "0.04em", fontWeight: "600" }],
                      "headline-md": ["26px", { lineHeight: "34px", fontWeight: "500" }],
                      "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
                      "label-sm": ["10px", { lineHeight: "14px", letterSpacing: "0.1em", fontWeight: "700" }]
                    }
                  }
                }
              };
            `
          }}
        />
      </head>
      <body className="bg-surface text-on-surface font-body-md text-body-md antialiased">{children}</body>
    </html>
  );
}
