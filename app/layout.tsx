import Shell from '@/components/shell';
import '../styles/globals.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
console.log("layout.tsx log");

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "Eunomia",
  //metadataBase: new URL("https://mccullen.gitlab.io/eunomia/")
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
        <GoogleTagManager gtmId="GTM-WRZN7BHT" />
        <Shell>
          {children}
        </Shell>
      </body>
      {/*<GoogleAnalytics gaId="G-W3GEZ55QRH" />*/}
    </html>
  )
}