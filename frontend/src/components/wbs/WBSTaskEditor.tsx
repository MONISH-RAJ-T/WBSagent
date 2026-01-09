"use client"
import { useState } from 'react'

interface WBSTask {
    id: string
    featureId: string
    name: string
    description: string
    hours: number
    type: 'R&D' | 'Dev'
    dependencies: string[]
    level: number
}

interface WBSTaskEditorProps {
    tasks: WBSTask[]
    onTasksChange: (tasks: WBSTask[]) => void
    onConfirm: () => void
    onBack: () => void
}

export default function WBSTaskEditor({ tasks, onTasksChange, onConfirm, onBack }: WBSTaskEditorProps) {
    const [editingTask, setEditingTask] = useState<string | null>(null)

    const addTask = () => {
        const newTask: WBSTask = {
            id: `T${tasks.length + 1}`,
            featureId: '',
            name: 'New Task',
            description: 'Task description',
            hours: 2,
            type: 'Dev',
            dependencies: [],
            level: 1
        }
        onTasksChange([...tasks, newTask])
    }

    const removeTask = (id: string) => {
        onTasksChange(tasks.filter(task => task.id !== id))
    }

    const updateTask = (id: string, updates: Partial<WBSTask>) => {
        onTasksChange(tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ))
    }

    const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0)
    const devHours = tasks.filter(t => t.type === 'Dev').reduce((sum, t) => sum + t.hours, 0)
    const rndHours = tasks.filter(t => t.type === 'R&D').reduce((sum, t) => sum + t.hours, 0)

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    📋 WBS Task Review & Editing
                </h2>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Tasks</div>
                        <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Hours</div>
                        <div className="text-2xl font-bold text-green-600">{totalHours}h</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Dev Hours</div>
                        <div className="text-2xl font-bold text-purple-600">{devHours}h</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">R&D Hours</div>
                        <div className="text-2xl font-bold text-yellow-600">{rndHours}h</div>
                    </div>
                </div>

                {/* Task List */}
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                        >
                            {editingTask === task.id ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={task.name}
                                        onChange={(e) => updateTask(task.id, { name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                                    />
                                    <textarea
                                        value={task.description}
                                        onChange={(e) => updateTask(task.id, { description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        rows={2}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Hours</label>
                                            <input
                                                type="number"
                                                value={task.hours}
                                                onChange={(e) => updateTask(task.id, { hours: parseFloat(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                step="0.5"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Type</label>
                                            <select
                                                value={task.type}
                                                onChange={(e) => updateTask(task.id, { type: e.target.value as 'R&D' | 'Dev' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="R&D">R&D</option>
                                                <option value="Dev">Dev</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingTask(null)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            ✓ Save
                                        </button>
                                        <button
                                            onClick={() => setEditingTask(null)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-sm text-gray-500">{task.id}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${task.type === 'R&D' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {task.type}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-700">{task.hours}h</span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900">{task.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => setEditingTask(task.id)}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => removeTask(task.id)}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                🗑️ Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Task Button */}
                <button
                    onClick={addTask}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors mb-6"
                >
                    + Add New Task
                </button>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
                    >
                        ← Back to Features
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-lg transition-colors shadow-lg"
                    >
                        ✓ Confirm WBS & Export
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Review and edit all tasks. Click "Confirm WBS" to proceed to export.
                </p>
            </div>
        </div>
    )
}
