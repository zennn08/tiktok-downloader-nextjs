import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tiktok Downloader',
  description: 'Download tiktok video and slides free',
  authors: [{
    name: "Akhlaqul Muhammad Fadwa",
    url: "https://aqul.my.id"
  }],
  keywords: "Tiktok downloader, tiktok video download, tiktok slides download, tiktok download no watermark",
  robots: "index, follow"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
