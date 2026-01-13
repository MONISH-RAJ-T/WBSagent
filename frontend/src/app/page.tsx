"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HomePage() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                WBS Generator
                            </span>
                            <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full">
                                AI
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <a
                                href="#features"
                                className="text-gray-700 font-medium hover:text-purple-600 transition-colors cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                Features
                            </a>

                            {/* CTA Button */}
                            <Link href="/project">
                                <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                                <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                                <span className="text-sm font-semibold text-purple-800">AI-Powered Project Planning</span>
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-purple-700 bg-clip-text text-transparent">
                                    AI-powered free WBS
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    simplified with WBS Generator
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                                Generate professional Work Breakdown Structures from project descriptions or PDF specifications using advanced AI.
                            </motion.p>

                            <motion.div variants={fadeInUp}>
                                <Link href="/project">
                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300">
                                        Get Started for Free
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-20 blur-xl"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl opacity-20 blur-xl"></div>

                                {/* Mock UI */}
                                <div className="relative space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900">Project Setup</h3>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">1</span>
                                                </div>
                                                <span className="font-semibold text-gray-900">Describe Project</span>
                                            </div>
                                            <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                                                <div className="h-full w-full bg-gradient-to-r from-purple-600 to-purple-700"></div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">2</span>
                                                </div>
                                                <span className="font-semibold text-gray-500">AI Analysis</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full"></div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">3</span>
                                                </div>
                                                <span className="font-semibold text-gray-500">Generate WBS</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div >
            </section >

            {/* Why Section */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-4">
                            Why WBS Generator?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We help project managers save time and create better project plans with AI-powered automation.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🤖',
                                title: 'AI-Powered Analysis',
                                description: 'Advanced machine learning extracts features from descriptions or PDF specs with 99% accuracy. No manual input required.'
                            },
                            {
                                icon: '⚡',
                                title: 'Lightning Fast',
                                description: 'Generate complete WBS in under 30 seconds. 10x faster than manual planning without compromising quality.'
                            },
                            {
                                icon: '📊',
                                title: 'Pro Export Options',
                                description: 'Export to Excel, CSV, JSON or integrate directly with Jira, Monday.com, Asana, and other PM tools.'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Features Grid */}
            < section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-4">
                            Some more WBS Generator features
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { title: 'PDF Analysis', desc: 'Upload project specs and let AI extract requirements automatically' },
                            { title: 'Competitor Research', desc: 'Automatic competitor analysis for better insights and market positioning' },
                            { title: 'Multi-format Export', desc: 'Excel, CSV, JSON - choose your preferred export format' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-4">
                                    <span className="text-white text-2xl font-bold">✓</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    )
}
