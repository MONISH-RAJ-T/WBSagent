"use client"
import { useState } from 'react'
import InitialInputForm from '../../../components/forms/InitialInputForm'

export default function ProjectPage() {
    const [projectData, setProjectData] = useState<any>(null)

    const handleSubmit = async (data: { projectName: string; description: string; hasPdf: boolean }) => {
        console.log('Project data:', data)
        setProjectData(data)

        // TODO: Route to appropriate flow based on hasPdf
        if (data.hasPdf) {
            console.log('→ Flow 1: PDF extraction path')
        } else {
            console.log('→ Flow 2: Competitor research path')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <InitialInputForm onSubmit={handleSubmit} />
        </div>
    )
}
