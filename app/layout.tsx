import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeverse.com";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument", // Creates a CSS variable
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ResumeVerse — Build Resumes That Get You Hired",
    template: "%s — ResumeVerse",
  },
  description:
    "AI-powered resume builder. Craft ATS-optimized resumes in minutes with GPT, export to PDF or Word, and land more interviews.",
  keywords: [
    "resume builder",
    "AI resume",
    "ATS resume",
    "cover letter generator",
    "resume templates",
    "job application",
    "CV builder",
  ],
  authors: [{ name: "ResumeVerse" }],
  creator: "ResumeVerse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "ResumeVerse",
    title: "ResumeVerse — Build Resumes That Get You Hired",
    description:
      "AI-powered resume builder with ATS scoring, JD match, cover letter generator, and interview prep. Start free.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ResumeVerse — AI Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeVerse — Build Resumes That Get You Hired",
    description:
      "AI-powered resume builder with ATS scoring, JD match, cover letter generator, and interview prep. Start free.",
    images: ["/og-image.svg"],
    creator: "@resumeverse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
