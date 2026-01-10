"use client"
import Link from 'next/link'
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Avatar
} from '@mui/material'
import {
    Rocket as RocketIcon,
    SmartToy as SmartToyIcon,
    BarChart as BarChartIcon,
    Description as DescriptionIcon
} from '@mui/icons-material'

export default function HomePage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Navigation */}
            <Box
                component="nav"
                sx={{
                    py: 2.5,
                    px: 4,
                    borderBottom: '1px solid',
                    borderColor: 'rgba(0,0,0,0.08)',
                    bgcolor: 'white'
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <RocketIcon sx={{ fontSize: 28, color: '#667eea' }} />
                            <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b' }}>
                                WBS Generator
                            </Typography>
                        </Box>
                        <Button
                            variant="text"
                            sx={{
                                color: '#667eea',
                                fontWeight: 600,
                                '&:hover': { background: 'rgba(102, 126, 234, 0.04)' }
                            }}
                        >
                            API Docs
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', pt: 10, pb: 8 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight="800"
                        sx={{
                            mb: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: { xs: '2.5rem', md: '4rem' }
                        }}
                    >
                        WBS Generator
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            mb: 5,
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: { xs: '1rem', md: '1.15rem' },
                            fontWeight: 400
                        }}
                    >
                        Transform project descriptions into structured, actionable task hierarchies using intelligent AI and the proven{' '}
                        <Typography component="span" sx={{ fontWeight: 700, color: '#667eea' }}>
                            8+2 rule
                        </Typography>
                        {' '}(8h development + 2h R&D per feature).
                    </Typography>
                    <Button
                        component={Link}
                        href="/project"
                        variant="contained"
                        size="large"
                        startIcon={<RocketIcon />}
                        sx={{
                            py: 1.8,
                            px: 4.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                            textTransform: 'none',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                            }
                        }}
                    >
                        Start New Project
                    </Button>
                </Box>

                {/* Feature Cards */}
                <Box sx={{ display: 'flex', gap: 3, mb: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { icon: SmartToyIcon, title: 'AI-Powered', desc: 'Automatically extracts features from project descriptions or PDF specifications', color: '#667eea' },
                        { icon: BarChartIcon, title: '8+2 Rule', desc: 'Every feature = exactly 10 hours (8h development + 2h research & design)', color: '#10b981' },
                        { icon: DescriptionIcon, title: 'Excel Export', desc: 'Professional formatted Excel files ready for project management tools', color: '#a855f7' }
                    ].map((feature) => (
                        <Card
                            key={feature.title}
                            elevation={0}
                            sx={{
                                flex: '1 1 300px',
                                maxWidth: 360,
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        mx: 'auto',
                                        mb: 3,
                                        bgcolor: `${feature.color}15`,
                                        color: feature.color
                                    }}
                                >
                                    <feature.icon sx={{ fontSize: 32 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {feature.desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* How It Works */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 10,
                        borderRadius: 4,
                        border: '1px solid rgba(0,0,0,0.08)',
                        overflow: 'hidden'
                    }}
                >
                    <CardContent sx={{ p: 5 }}>
                        <Typography
                            variant="h4"
                            fontWeight="800"
                            textAlign="center"
                            sx={{ mb: 5, color: '#1e293b' }}
                        >
                            How It Works
                        </Typography>
                        <Stack spacing={4}>
                            {[
                                { number: 1, title: 'Input Project Details', description: 'Provide project name and description, or upload a PDF specification' },
                                { number: 2, title: 'AI Extracts Features', description: 'Cloud AI extracts key features and analyzes competitors' },
                                { number: 3, title: 'Generate WBS', description: 'Each feature is broken down into tasks following the 8+2 rule' },
                                { number: 4, title: 'Export & Use', description: 'Download as Excel, CSV, or JSON for your project management tools' }
                            ].map((step) => (
                                <Box key={step.number} sx={{ display: 'flex', gap: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            flexShrink: 0,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            fontWeight: 700,
                                            fontSize: '1.25rem'
                                        }}
                                    >
                                        {step.number}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}
