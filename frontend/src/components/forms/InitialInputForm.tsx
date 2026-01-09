"use client"
import { useState } from 'react'
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Chip,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material'
import {
    Upload as UploadIcon,
    Description as DescriptionIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

interface InitialInputProps {
    onSubmit: (data: { projectName: string; description: string; hasPdf: boolean }) => void
}

export default function InitialInputForm({ onSubmit }: InitialInputProps) {
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setPdfFile(file)
        }
    }

    const handleSubmit = () => {
        if (!projectName.trim() || !description.trim()) {
            return
        }
        setLoading(true)
        onSubmit({
            projectName,
            description,
            hasPdf: !!pdfFile,
        })
    }

    const isValid = projectName.trim() && description.trim()

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        🚀 WBS Generator
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Transform your project into a structured work breakdown structure
                    </Typography>
                </Box>

                {/* Stepper */}
                <Stepper activeStep={0} sx={{ mb: 4 }}>
                    <Step>
                        <StepLabel>Project Details</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Features</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>WBS Tasks</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Export</StepLabel>
                    </Step>
                </Stepper>

                {/* Form Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Project Name */}
                    <TextField
                        label="Project Name"
                        placeholder="e.g., E-Commerce Platform"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        InputProps={{
                            startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                    />

                    {/* Description */}
                    <TextField
                        label="Project Description"
                        placeholder="Describe your project in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={5}
                        variant="outlined"
                    />

                    {/* PDF Upload (Optional) */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            Product Specifications (Optional)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadIcon />}
                                disabled={loading}
                            >
                                Upload PDF
                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf "
                                    onChange={handleFileUpload}
                                />
                            </Button>
                            {pdfFile && (
                                <Chip
                                    label={pdfFile.name}
                                    onDelete={() => setPdfFile(null)}
                                    color="primary"
                                    variant="outlined"
                                    icon={<CheckCircleIcon />}
                                />
                            )}
                        </Box>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            {pdfFile
                                ? '📄 With PDF: Features will be extracted automatically'
                                : '📝 Without PDF: AI will research competitors and suggest features'}
                        </Alert>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? 'Processing...' : pdfFile ? 'Extract Features from PDF' : 'Research & Generate Features'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}
