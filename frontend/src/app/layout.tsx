import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProvidersWrapper from '../components/ProvidersWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'WBS Generator',
    description: 'AI-powered Work Breakdown Structure Generator',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ProvidersWrapper>
                    {children}
                </ProvidersWrapper>
            </body>
        </html>
    )
}
