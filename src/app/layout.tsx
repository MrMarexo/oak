import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="flex justify-center border-b-[1px] px-4">
            <div className="max-w-[1200px] w-full flex justify-between items-center py-1">
              <Link href="/" className="text-4xl font-bold">
                Oak
              </Link>
            </div>
          </header>
          <main className="flex flex-1 justify-center px-4">
            <div className="max-w-[1200px] w-full my-10">{children}</div>
          </main>
          <footer className="bottom-0 flex justify-center border-t-[1px] px-4 bg-background">
            <div className="max-w-[1200px] w-full flex justify-center items-center py-1 gap-20">
              <p>
                made by{" "}
                <a
                  target="_blank"
                  href="https://marekchovan.vercel.app"
                  className="font-bold"
                >
                  Marexo
                </a>
              </p>
              <p>
                in{" "}
                <a
                  target="_blank"
                  href="https://nextjs.org"
                  className="font-bold"
                >
                  Next.js
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
