"use client"
import { useState } from 'react'
import { ProjectRequest, FeatureListResponse } from '../../types'
import { featureAPI } from '../../services/api'

export default function ProjectInputForm() {
    const [formData, setFormData] = useState<ProjectRequest>({
        project_name: '',
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [features, setFeatures] = useState<FeatureListResponse | null>(null)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await featureAPI.generateFeatures(formData)
            setFeatures(response)
        } catch (err: any) {
            setError(err.message || 'Failed to generate features')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📋 Create New Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.project_name}
                        onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Meeting Notes Mobile App"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe what the project should do..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? '🤖 Generating Features...' : '✨ Generate Features'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {features && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                        ✨ {features.total_features} Features Generated!
                    </h3>
                    <ul className="space-y-2">
                        {features.features.slice(0, 5).map((feature) => (
                            <li key={feature.id} className="flex items-center p-3 bg-white rounded border">
                                <span className="font-medium text-gray-900 mr-3">{feature.name}</span>
                                <span className="text-sm text-gray-500">{feature.description}</span>
                            </li>
                        ))}
                    </ul>
                    {features.features.length > 5 && (
                        <p className="mt-2 text-sm text-green-700">
                            +{features.features.length - 5} more features...
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
