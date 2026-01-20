// TypeScript Types for WBS Generator

export interface ProjectRequest {
    project_name: string
    description: string
}

export interface FeatureAnalysis {
    needs_rnd: boolean
    needs_ui: boolean
    needs_db: boolean
    dev_complexity: string  // "simple" | "medium" | "complex"
    dev_hours: number
    rnd_hours: number
    ui_hours: number
    db_hours: number
    unit_test_hours: number  // Auto-calculated: 20% of dev
    qa_hours: number  // Fixed: 2 hours
    total_hours: number
    reasoning: string
}

export interface Feature {
    id: string
    name: string
    description: string
    priority?: string
    confidence?: number
    execution_order?: number  // Sequential order: 1, 2, 3...
    reasoning?: string  // AI's explanation for ordering
    category_name?: string  // Category label
    analysis?: FeatureAnalysis  // NEW: Intelligent task breakdown analysis
}

export interface FlowGenerateRequest {
    project_name: string
    description: string
    features: Feature[]
}

export interface FeatureListResponse {
    project_name: string
    features: Feature[]
    total_features: number
}

export interface WBSTask {
    id: string
    name: string
    description: string
    duration_hours: number
    dependencies: string[]
    level: number
    parent_id?: string
    task_type: string  // "Dev" or "R&D"
}

export interface WBSResponse {
    project_name: string
    tasks: WBSTask[]
    total_tasks: number
    total_hours: number
}

export interface Competitor {
    name: string
    features: string[]
}

export interface CompetitorAnalysisResponse {
    competitors: Competitor[]
    missing_features: string[]
    recommendations: string[]
}

export interface ExportRequest {
    project_name: string
    tasks: WBSTask[]
    format: 'excel' | 'pdf' | 'csv'
}

export interface WBSGenerateRequest {
    project_name: string
    features: string[]
}
