import { Box, CircularProgress, Typography, Fade, Grow } from '@mui/material'
import { useState, useEffect } from 'react'

interface ModernLoadingProps {
    message?: string
    tips?: string[]
}

export default function ModernLoading({ 
    message = "Processing your request...", 
    tips = [] 
}: ModernLoadingProps) {
    const [currentTip, setCurrentTip] = useState(0)

    useEffect(() => {
        if (tips.length === 0) return
        
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [tips.length])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                textAlign: 'center',
                position: 'relative'
            }}
        >
            {/* Animated Background Circles */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                    animation: 'pulse 2s ease-in-out infinite'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
                    animation: 'pulse 2s ease-in-out infinite 0.5s'
                }}
            />

            {/* Loading Spinner */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: 'transparent',
                        '& .MuiCircularProgress-circle': {
                            stroke: 'url(#gradient)',
                            strokeLinecap: 'round'
                        }
                    }}
                />
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#6366f1' }} />
                            <stop offset="50%" style={{ stopColor: '#8b5cf6' }} />
                            <stop offset="100%" style={{ stopColor: '#ec4899' }} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Icon */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        animation: 'float 3s ease-in-out infinite'
                    }}
                />
            </Box>

            {/* Message */}
            <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #1e293b, #6366f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                {message}
            </Typography>

            {/* Rotating Tips */}
            {tips.length > 0 && (
                <Box sx={{ height: 40, display: 'flex', alignItems: 'center' }}>
                    <Fade in={true} key={currentTip}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                maxWidth: 400,
                                lineHeight: 1.6,
                                fontStyle: 'italic'
                            }}
                        >
                            💡 {tips[currentTip]}
                        </Typography>
                    </Fade>
                </Box>
            )}

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.1;
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-6px);
                    }
                }
            `}</style>
        </Box>
    )
}