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
} from '@mui/material'
import {
    Upload as UploadIcon,
    Description as DescriptionIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    Rocket as RocketIcon,
} from '@mui/icons-material'

interface InitialInputProps {
    onSubmit: (data: { projectName: string; description: string; hasPdf: boolean; pdfFile?: File }) => void
    loading?: boolean
}

export default function InitialInputForm({ onSubmit, loading = false }: InitialInputProps) {
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [pdfFile, setPdfFile] = useState<File | null>(null)

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
        onSubmit({
            projectName,
            description,
            hasPdf: !!pdfFile,
            pdfFile: pdfFile || undefined,
        })
    }

    const isValid = projectName.trim() && description.trim()

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box className="animate-fade-in-up stagger-1">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.08), 0 0 1px rgba(0, 0, 0, 0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        }
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                mb: 2,
                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.25)',
                            }}
                        >
                            <RocketIcon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            fontWeight="800"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            WBS Generator
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                            Transform your project into a structured work breakdown structure
                        </Typography>
                    </Box>

                    {/* Form Fields */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                        {/* Project Name */}
                        <Box className="animate-fade-in-up stagger-2">
                            <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                sx={{ mb: 1.5, color: 'text.primary' }}
                            >
                                Project Name *
                            </Typography>
                            <TextField
                                placeholder="e.g., E-Commerce Platform"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                                        }
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <DescriptionIcon sx={{ mr: 1.5, color: '#667eea' }} />,
                                }}
                            />
                        </Box>

                        {/* Description */}
                        <Box className="animate-fade-in-up stagger-3">
                            <Typography
                                variant="subtitle2"
                                fontWeight="600"
                                sx={{ mb: 1.5, color: 'text.primary' }}
                            >
                                Project Description *
                            </Typography>
                            <TextField
                                placeholder="Describe your project vision, key features, and target audience..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                required
                                multiline
                                rows={5}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* PDF Upload (Optional) */}
                        <Box className="animate-fade-in-up stagger-4">
                            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: 'text.primary' }}>
                                Product Specifications (Optional)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<UploadIcon />}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.2,
                                        borderColor: '#667eea',
                                        color: '#667eea',
                                        '&:hover': {
                                            borderColor: '#764ba2',
                                            background: 'rgba(102, 126, 234, 0.04)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                                        }
                                    }}
                                >
                                    Upload PDF
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf"
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
                                        sx={{
                                            borderRadius: 2,
                                            animation: 'scaleIn 0.3s ease-out',
                                        }}
                                    />
                                )}
                            </Box>
                            <Alert
                                severity="info"
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                    border: '1px solid rgba(102, 126, 234, 0.2)',
                                    background: 'rgba(102, 126, 234, 0.03)',
                                }}
                            >
                                {pdfFile
                                    ? '📄 With PDF: Features will be extracted automatically'
                                    : '🤖 Without PDF: AI will research competitors and suggest features'}
                            </Alert>
                        </Box>

                        {/* Submit Button */}
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={!isValid || loading}
                            endIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <ArrowForwardIcon />}
                            sx={{
                                py: 1.8,
                                borderRadius: 2.5,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 28px rgba(102, 126, 234, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                },
                                '&.Mui-disabled': {
                                    background: '#e0e0e0',
                                    color: '#9e9e9e',
                                }
                            }}
                        >
                            {loading ? 'Processing...' : pdfFile ? 'Extract Features from PDF' : 'Research & Generate Features'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}
