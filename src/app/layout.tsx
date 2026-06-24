import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'bcarte · Votre identité professionnelle vérifiée',
  description: 'Plateforme de profil professionnel vérifié avec générateur de CV par IA et carte de visite NFC.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
