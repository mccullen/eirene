"use client"
import Shell from '@/components/shell';
import '../styles/globals.css'
console.log("Here");

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