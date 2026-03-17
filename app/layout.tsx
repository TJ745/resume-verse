// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "ResumeVerse - AI-Powered Resume Builder",
//   description:
//     "Create professional resumes effortlessly with ResumeVerse, the AI-powered resume builder. Tailor your resume to job descriptions and stand out to employers.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased rv-page`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

// import type { Metadata } from "next";
// import "./globals.css";

// const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeverse.com";

// export const metadata: Metadata = {
//   metadataBase: new URL(APP_URL),
//   title: {
//     default: "ResumeVerse — Build Resumes That Get You Hired",
//     template: "%s — ResumeVerse",
//   },
//   description:
//     "AI-powered resume builder. Craft ATS-optimized resumes in minutes with GPT, export to PDF or Word, and land more interviews.",
//   keywords: [
//     "resume builder",
//     "AI resume",
//     "ATS resume",
//     "cover letter generator",
//     "resume templates",
//     "job application",
//     "CV builder",
//   ],
//   authors: [{ name: "ResumeVerse" }],
//   creator: "ResumeVerse",
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: APP_URL,
//     siteName: "ResumeVerse",
//     title: "ResumeVerse — Build Resumes That Get You Hired",
//     description:
//       "AI-powered resume builder with ATS scoring, JD match, cover letter generator, and interview prep. Start free.",
//     images: [
//       {
//         url: "/og-image.svg",
//         width: 1200,
//         height: 630,
//         alt: "ResumeVerse — AI Resume Builder",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "ResumeVerse — Build Resumes That Get You Hired",
//     description:
//       "AI-powered resume builder with ATS scoring, JD match, cover letter generator, and interview prep. Start free.",
//     images: ["/og-image.svg"],
//     creator: "@resumeverse",
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeverse.com";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
