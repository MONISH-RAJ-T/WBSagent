import Link from 'next/link'

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        WBS Generator
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Transform project descriptions into structured, actionable task hierarchies
                        using intelligent AI and the proven <span className="font-bold text-blue-600">8+2 rule</span>
                        (8h development + 2h R&D per feature).
                    </p>
                    <Link
                        href="/project"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl"
                    >
                        🚀 Start New Project
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-24">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🤖</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered</h3>
                        <p className="text-gray-600">
                            Automatically extracts features from project descriptions or PDF specifications
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">📊</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">8+2 Rule</h3>
                        <p className="text-gray-600">
                            Every feature = exactly 10 hours (8h development + 2h research & design)
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">📈</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Excel Export</h3>
                        <p className="text-gray-600">
                            Professional formatted Excel files ready for project management tools
                        </p>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-24 bg-white rounded-3xl shadow-2xl p-12">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        How It Works
                    </h2>
                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                1
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Input Project Details</h4>
                                <p className="text-gray-600">Provide project name and description, or upload a PDF specification</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                2
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">AI Extracts Features</h4>
                                <p className="text-gray-600">Local AI (Ollama) or cloud AI extracts key features and analyzes competitors</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                3
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Generate WBS</h4>
                                <p className="text-gray-600">Each feature is broken down into tasks following the 8+2 rule</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                4
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Export & Use</h4>
                                <p className="text-gray-600">Download as Excel, CSV, or JSON for your project management tools</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
