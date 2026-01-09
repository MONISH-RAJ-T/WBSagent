"use client"
import { useState } from 'react'
import { Feature } from '@/types'

interface FeatureEditorProps {
    initialFeatures: Feature[]
    onSave: (features: Feature[]) => void
    projectName: string
}

export default function FeatureEditor({ initialFeatures, onSave, projectName }: FeatureEditorProps) {
    const [features, setFeatures] = useState<Feature[]>(initialFeatures)
    const [isEditing, setIsEditing] = useState(false)

    const addFeature = () => {
        const newFeature: Feature = {
            id: `f${features.length + 1}`,
            name: '',
            description: '',
            priority: 'medium'
        }
        setFeatures([...features, newFeature])
        setIsEditing(true)
    }

    const removeFeature = (id: string) => {
        setFeatures(features.filter(f => f.id !== id))
    }

    const updateFeature = (id: string, field: keyof Feature, value: string) => {
        setFeatures(features.map(f =>
            f.id === id ? { ...f, [field]: value } : f
        ))
    }

    const handleSave = () => {
        onSave(features)
        setIsEditing(false)
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                    📋 Features for {projectName}
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={addFeature}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium transition-all"
                    >
                        ➕ Add Feature
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-all"
                        >
                            💾 Save Changes
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div
                        key={feature.id}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                                <input
                                    type="text"
                                    value={feature.name}
                                    onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                                    className="text-xl font-semibold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2"
                                    placeholder="Feature name..."
                                />
                            </div>
                            <button
                                onClick={() => removeFeature(feature.id)}
                                className="text-red-600 hover:text-red-800 font-bold text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                            placeholder="Feature description..."
                        />

                        <div className="mt-3 flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700">Priority:</label>
                            <select
                                value={feature.priority}
                                onChange={(e) => updateFeature(feature.id, 'priority', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {features.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl mb-4">No features yet</p>
                    <button
                        onClick={addFeature}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        ➕ Add Your First Feature
                    </button>
                </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-2">💡 Next Step</h3>
                <p className="text-blue-800">
                    Once you're happy with the features, we'll generate a Work Breakdown Structure
                    using the <span className="font-bold">8+2 rule</span> (8 hours dev + 2 hours R&D per feature).
                </p>
            </div>
        </div>
    )
}
