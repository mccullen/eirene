import Shell from '@/components/shell';
import '../styles/globals.css'
console.log("layout.tsx log");

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "Eirene",
  metadataBase: new URL("https://mccullen.gitlab.io/eirene")
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
      </html>
    )
  }