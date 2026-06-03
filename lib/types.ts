export interface Call {
  id: string
  retell_call_id: string
  from_number: string | null
  to_number: string | null
  start_time: string | null
  end_time: string | null
  duration_seconds: number | null
  status: string | null
  transcript: TranscriptTurn[] | null
  // Post-call analysis
  call_summary: string | null
  call_successful: boolean | null
  user_sentiment: string | null
  clinical_case_description: string | null
  value_delivered: string | null
  type_of_service: string | null
  service_type_classification: string[] | null
  provider_full_name: string | null
  // Trouble indicators
  disconnection_reason: string | null
  who_hung_up: string | null
  // Raw catch-all for any extra fields Retell returns
  raw_analysis: Record<string, unknown> | null
  created_at: string
}

export interface TranscriptTurn {
  role: 'agent' | 'user'
  content: string
}

export interface CallsFilter {
  dateFrom?: string
  dateTo?: string
  fromNumber?: string
  providerName?: string
  callSuccessful?: 'true' | 'false'
  userSentiment?: string
  serviceTypeClassification?: string
  page?: number
  pageSize?: number
}

export interface CallsResponse {
  calls: Call[]
  total: number
  page: number
  pageSize: number
}

export interface DashboardData {
  totalCalls: number
  successfulCalls: number
  avgDurationSeconds: number
  uniqueProviders: number
  callsByDay: { date: string; count: number }[]
  sentimentBreakdown: { sentiment: string; count: number }[]
  serviceTypeBreakdown: { service: string; count: number }[]
  successRate: number
}
