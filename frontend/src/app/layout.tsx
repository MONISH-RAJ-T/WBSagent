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
                    <nav className="bg-white shadow-lg border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <a href="/" className="text-2xl font-bold text-gray-900">
                                        🚀 WBS Generator
                                    </a>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <a href="http://localhost:8000/docs" target="_blank" className="text-blue-600 hover:text-blue-800 font-medium">
                                        API Docs
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {children}
                </ProvidersWrapper>
            </body>
        </html>
    )
}
