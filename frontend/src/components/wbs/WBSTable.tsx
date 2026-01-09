import { WBSTask } from '@/types'

interface WBSTableProps {
    tasks: WBSTask[]
    projectName: string
}

export default function WBSTable({ tasks, projectName }: WBSTableProps) {
    const devTasks = tasks.filter(t => t.task_type === 'Dev')
    const rndTasks = tasks.filter(t => t.task_type === 'R&D')

    const totalHours = tasks.reduce((sum, t) => sum + t.duration_hours, 0)
    const devHours = devTasks.reduce((sum, t) => sum + t.duration_hours, 0)
    const rndHours = rndTasks.reduce((sum, t) => sum + t.duration_hours, 0)

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    📊 Work Breakdown Structure
                </h2>
                <p className="text-gray-600">Project: <span className="font-semibold">{projectName}</span></p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-600">{totalHours}h</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-600">{devHours}h</div>
                    <div className="text-sm text-gray-600">Dev Hours</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-orange-600">{rndHours}h</div>
                    <div className="text-sm text-gray-600">R&D Hours</div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="text-left p-4 font-bold text-gray-700">ID</th>
                            <th className="text-left p-4 font-bold text-gray-700">Task Name</th>
                            <th className="text-left p-4 font-bold text-gray-700">Description</th>
                            <th className="text-left p-4 font-bold text-gray-700">Type</th>
                            <th className="text-left p-4 font-bold text-gray-700">Hours</th>
                            <th className="text-left p-4 font-bold text-gray-700">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr
                                key={task.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                <td className="p-4 font-mono text-sm text-gray-600">{task.id}</td>
                                <td className="p-4 font-semibold text-gray-900">{task.name}</td>
                                <td className="p-4 text-sm text-gray-600">{task.description}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${task.task_type === 'Dev'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}
                                    >
                                        {task.task_type}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-blue-600">{task.duration_hours}h</td>
                                <td className="p-4 text-gray-600">L{task.level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No tasks generated yet</p>
                </div>
            )}

            <div className="mt-8 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-2">✅ 8+2 Rule Applied</h3>
                <p className="text-green-800 text-sm">
                    Each feature has been broken down into exactly 10 hours:
                    <span className="font-bold"> 8 hours of development</span> and
                    <span className="font-bold"> 2 hours of R&D</span>.
                </p>
            </div>
        </div>
    )
}
