import type {Metadata} from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Born to Feast Studio",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
