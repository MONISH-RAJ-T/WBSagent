"use client"
import { useState } from 'react'
import InitialInputForm from '../../../components/forms/InitialInputForm'
import FeatureSelectionForm from '../../../components/forms/FeatureSelectionForm'
import WBSTaskEditor from '../../../components/forms/WBSTaskEditor'
import { featureAPI, wbsAPI, exportAPI } from '../../../services/api'
import { Feature, CompetitorAnalysisResponse, WBSTask, WBSResponse } from '@/types'
import {
    Container,
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Paper,
    LinearProgress,
    Chip,
    Card,
    CardContent,
    Fab,
    Zoom,
    Button
} from '@mui/material'
import {
    CheckCircle,
    RadioButtonUnchecked,
    ArrowBack,
    ArrowForward,
    Download,
    Lightbulb
} from '@mui/icons-material'

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

    const steps = ['Project Setup', 'Feature Review', 'Flow Design', 'Task Breakdown', 'Export & Use']

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
        <Box
            sx={{
                minHeight: '100vh',
                background: `
                    radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
                    linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)
                `,
                position: 'relative'
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                    color: 'white',
                    py: 6,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.1))',
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <Typography variant="h3" fontWeight="800" sx={{ mb: 2 }}>
                            {projectData?.projectName || 'New Project'}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                            Transform your project idea into a structured work breakdown with AI assistance
                        </Typography>
                        {loading && (
                            <Box sx={{ mt: 3 }}>
                                <LinearProgress
                                    sx={{
                                        borderRadius: 2,
                                        height: 8,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'rgba(255,255,255,0.8)'
                                        }
                                    }}
                                />
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                    AI is analyzing your project...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Modern Stepper */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        overflow: 'hidden'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{
                                '& .MuiStepConnector-root': {
                                    top: 12,
                                    '&.Mui-completed .MuiStepConnector-line': {
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                    }
                                },
                                '& .MuiStepLabel-root': {
                                    '& .MuiStepLabel-iconContainer': {
                                        '& .Mui-completed': {
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white'
                                        },
                                        '& .Mui-active': {
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: 'white'
                                        }
                                    }
                                }
                            }}
                        >
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconComponent={({ active, completed }) => (
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: completed
                                                        ? 'linear-gradient(135deg, #10b981, #059669)'
                                                        : active
                                                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                            : 'rgba(148, 163, 184, 0.2)',
                                                    color: completed || active ? 'white' : '#64748b',
                                                    fontWeight: 700,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {completed ? <CheckCircle sx={{ fontSize: 20 }} /> : index + 1}
                                            </Box>
                                        )}
                                    >
                                        <Typography variant="body2" fontWeight={activeStep === index ? 700 : 500}>
                                            {label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                    <Paper
                        sx={{
                            mb: 4,
                            p: 3,
                            borderRadius: '16px',
                            bgcolor: '#fff5f5',
                            border: '1px solid #feb2b2',
                            color: '#c53030'
                        }}
                    >
                        <Typography fontWeight="bold" sx={{ mb: 1 }}>⚠️ Error</Typography>
                        <Typography variant="body2">{error}</Typography>
                    </Paper>
                )}

                {/* Render Step Content */}
                {renderStepContent()}
            </Container>
        </Box>
    )
}
