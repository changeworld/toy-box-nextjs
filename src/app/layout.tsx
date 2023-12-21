import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Toy Box',
  description: 'Project Toy Box'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        {children}
      </body>
    </html>
  )
}
