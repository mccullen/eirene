import Shell from '@/components/shell';
import '../styles/globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
console.log("layout.tsx log");

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "Eirene",
  //metadataBase: new URL("https://mccullen.gitlab.io/eirene")
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
            <Shell>
                {children}
            </Shell>
        </body>
        <GoogleAnalytics gaId="G-W3GEZ55QRH" />
      </html>
    )
  }