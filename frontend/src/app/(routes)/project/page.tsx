"use client"
import { useState } from 'react'
import InitialInputForm from '../../../components/forms/InitialInputForm'
import FeatureSelectionForm from '../../../components/forms/FeatureSelectionForm'
import WBSTaskEditor from '../../../components/forms/WBSTaskEditor'
import { featureAPI, wbsAPI, exportAPI } from '../../../services/api'
import { Feature, CompetitorAnalysisResponse, WBSTask, WBSResponse } from '@/types'
import { Container, Box, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material'

import FlowEditor from '../../../components/wbs/FlowEditor'

export default function ProjectPage() {
    const [projectData, setProjectData] = useState<any>(null)
    const [features, setFeatures] = useState<Feature[]>([])
    const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysisResponse | null>(null)
    const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([])
    const [wbsResponse, setWbsResponse] = useState<WBSResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeStep, setActiveStep] = useState(0)

    const steps = ['Project Details', 'Review Features', 'Execution Flow', 'WBS Tasks', 'Export']

    const handleInitialSubmit = async (data: { projectName: string; description: string; hasPdf: boolean; pdfFile?: File }) => {
        setProjectData(data)
        setError(null)
        setLoading(true)

        try {
            // Generate features and research competitors in parallel
            const [featureResponse, competitorResponse] = await Promise.all([
                data.hasPdf && data.pdfFile
                    ? featureAPI.extractFromPDF(data.pdfFile, data.projectName)
                    : featureAPI.generateFeatures({
                        project_name: data.projectName,
                        description: data.description
                    }),
                featureAPI.analyzeCompetitors({
                    project_name: data.projectName,
                    description: data.description
                })
            ])

            setFeatures(featureResponse.features)
            setCompetitorAnalysis(competitorResponse)
            setActiveStep(1) // Move to feature selection
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to generate features')
        } finally {
            setLoading(false)
        }
    }

    const handleFeatureSelectionSubmit = async (selectedFeatures: Feature[]) => {
        setSelectedFeatureIds(selectedFeatures.map(f => f.id))
        setError(null)
        setLoading(true)

        try {
            const selectedFeatureNames = selectedFeatures.map(f => f.name)

        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to generate WBS')
        } finally {
            setLoading(false)
        }
    }

    const handleFlowSave = async (featuresWithDeps: Feature[]) => {
        setFeatures(featuresWithDeps)
        setLoading(true)
        setError(null)

        try {
            // Generate WBS with dependencies
            const response = await wbsAPI.generateWBS({
                project_name: projectData.projectName,
                features: featuresWithDeps // Sending full objects now
            } as any) // Cast as any because frontend types might need update if Strict Mode

            setWbsResponse(response)
            setActiveStep(3) // WBS Step is now index 3
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to generate WBS from flow')
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async (tasks: WBSTask[], format: 'excel' | 'csv' | 'json') => {
        try {
            if (format === 'json') {
                const data = await exportAPI.exportToJSON(projectData.projectName, tasks)
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${projectData.projectName}_wbs.json`
                a.click()
                return
            }

            const blob = format === 'excel'
                ? await exportAPI.exportToExcel(projectData.projectName, tasks)
                : await exportAPI.exportToCSV(projectData.projectName, tasks)

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${projectData.projectName}_wbs.${format === 'excel' ? 'xlsx' : 'csv'}`
            a.click()
        } catch (err: any) {
            setError(`Export failed: ${err.message}`)
        }
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <InitialInputForm onSubmit={handleInitialSubmit} loading={loading} />
            case 1:
                return (
                    <FeatureSelectionForm
                        features={features}
                        competitors={competitorAnalysis?.competitors || []}
                        onBack={() => setActiveStep(0)}
                        onSubmit={(selected) => {
                            setFeatures(selected);
                            setActiveStep(2); // Go to Flow
                        }}
                        loading={loading}
                    />
                )
            case 2:
                return (
                    <FlowEditor
                        projectName={projectData?.projectName || ''}
                        description={projectData?.description || ''}
                        features={features}
                        onSave={handleFlowSave}
                        onBack={() => setActiveStep(1)}
                    />
                )
            case 3:
                return (
                    <WBSTaskEditor
                        tasks={wbsResponse?.tasks || []}
                        projectName={projectData?.projectName || ''}
                        onBack={() => setActiveStep(2)}
                        onExport={handleExport}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Box sx={{ minHeight: 'screen', bgcolor: '#f8fafc', py: 4 }}>
            <Container maxWidth="lg">
                <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030' }}>
                        <Typography fontWeight="bold">Error</Typography>
                        <Typography variant="body2">{error}</Typography>
                    </Paper>
                )}

                {renderStepContent()}
            </Container>
        </Box>
    )
}
