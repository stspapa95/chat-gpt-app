import type { Metadata } from "next";
import React from "react";
import { Poppins } from "@next/font/google";
import "./globals.css";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJS ChatGPT App",
  description: "ChatGPT brought to you by NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <header className={"p-6 text-white font-bold bg-green-900 text-2xl"}>
          <div className={"flex flex-grow items-center"}>
            <Link href={"/"}>GPT Chat</Link>
            <Link href={"/about"} className={"ml-5 font-light"}>
              About
            </Link>
          </div>
        </header>
        <div className={"flex flex-col md:flex-row"}>
          <div className={"flex-grow"}>{children}</div>
        </div>
      </body>
    </html>
  );
}
