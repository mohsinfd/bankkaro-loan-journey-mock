import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BankKaro Loan Journey Mock',
  description: 'Interactive mock UX/UI flow for BankKaro Pre-Qualified Loan Journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
