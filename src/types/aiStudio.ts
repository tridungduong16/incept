export type Severity = 'high' | 'medium' | 'low'
export type Confidence = 'high' | 'medium' | 'low'

export type AIInsight = {
  id: string
  title: string
  summary: string
  confidence: Confidence
  updatedAt: string
}

export type MarketSignal = {
  marketPair: string
  marketTitle: string
  direction: 'up' | 'down' | 'neutral'
  magnitude: number
  reason: string
}

export type NewsItem = {
  id: string
  headline: string
  source: string
  publishedAt: string
  relatedMarkets: string[]
  impactScore: number
}

export type Catalyst = {
  id: string
  marketPair: string
  type: 'news-driven' | 'price-momentum' | 'volume-spike' | 'event-driven'
  description: string
  severity: Severity
  evidence: string
  detectedAt: string
}

export type MispricingAlert = {
  id: string
  marketPair: string
  marketTitle: string
  spreadPct: number
  zScore: number
  severity: Severity
  opportunity: string
  riskNote: string
  volume24h: string
}

export type ResolutionSource = {
  marketPair: string
  primarySource: string
  backupSource: string
  resolutionRule: string
  lastVerifiedAt: string
  trustLevel: 'verified' | 'pending' | 'stale'
  history: { date: string; change: string }[]
}
