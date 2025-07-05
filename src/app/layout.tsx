import "./globals.css";

export const metadata = {
  title: "Tappr - Your Digital Dating Card",
  description: "Share your dating profile instantly with NFC cards. No apps to download, no awkward exchanges. Just tap and connect.",
  keywords: "dating, NFC, cards, profile, modern dating, tappr",
  authors: [{ name: "Tappr Team" }],
  openGraph: {
    title: "Tappr - Your Digital Dating Card",
    description: "Share your dating profile instantly with NFC cards. No apps to download, no awkward exchanges. Just tap and connect.",
    url: "https://tappr.app",
    siteName: "Tappr",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tappr - Digital Dating Cards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tappr - Your Digital Dating Card",
    description: "Share your dating profile instantly with NFC cards. No apps to download, no awkward exchanges. Just tap and connect.",
    images: ["/og-image.png"],
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