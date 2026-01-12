import axios from 'axios'
import {
    ProjectRequest,
    FeatureListResponse,
    WBSResponse,
    CompetitorAnalysisResponse,
    WBSGenerateRequest,
    WBSTask
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Feature API
export const featureAPI = {
    generateFeatures: async (request: ProjectRequest): Promise<FeatureListResponse> => {
        const response = await apiClient.post('/api/features/generate', request)
        return response.data
    },

    extractFromPDF: async (file: File, projectName: string): Promise<FeatureListResponse> => {
        const formData = new FormData()
        formData.append('pdf_file', file)
        formData.append('project_name', projectName)

        const response = await apiClient.post('/api/features/extract-pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return response.data
    },

    analyzeCompetitors: async (request: ProjectRequest): Promise<CompetitorAnalysisResponse> => {
        const response = await apiClient.post('/api/features/competitors', request)
        return response.data
    },

    validateFeatures: async (features: string[]): Promise<any> => {
        const response = await apiClient.post('/api/features/validate', features)
        return response.data
    },

    generateFlow: async (request: any): Promise<FeatureListResponse> => {
        const response = await apiClient.post('/api/features/flow', request)
        return response.data
    },
}

// WBS API
export const wbsAPI = {
    generateWBS: async (request: WBSGenerateRequest): Promise<WBSResponse> => {
        const response = await apiClient.post('/api/wbs/generate', request)
        return response.data
    },

    validateWBS: async (tasks: WBSTask[]): Promise<any> => {
        const response = await apiClient.post('/api/wbs/validate', tasks)
        return response.data
    },

    getStats: async (projectName: string): Promise<any> => {
        const response = await apiClient.get(`/api/wbs/stats/${projectName}`)
        return response.data
    },
}

// Export API
export const exportAPI = {
    exportToExcel: async (projectName: string, tasks: WBSTask[]): Promise<Blob> => {
        const response = await apiClient.post(
            '/api/export/excel',
            { project_name: projectName, tasks },
            { responseType: 'blob' }
        )
        return response.data
    },

    exportToCSV: async (projectName: string, tasks: WBSTask[]): Promise<Blob> => {
        const response = await apiClient.post(
            '/api/export/csv',
            { project_name: projectName, tasks },
            { responseType: 'blob' }
        )
        return response.data
    },

    exportToJSON: async (projectName: string, tasks: WBSTask[]): Promise<any> => {
        const response = await apiClient.post('/api/export/json', {
            project_name: projectName,
            tasks,
        })
        return response.data
    },
}

// AI API
export const aiAPI = {
    testOllama: async (): Promise<any> => {
        const response = await apiClient.post('/api/ai/test-ollama')
        return response.data
    },

    testGemini: async (): Promise<any> => {
        const response = await apiClient.post('/api/ai/test-gemini')
        return response.data
    },

    listModels: async (): Promise<any> => {
        const response = await apiClient.get('/api/ai/models')
        return response.data
    },
}

export default apiClient
