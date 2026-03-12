import {
  allMarkets,
  candlestickData,
  eventTimeline,
  marketCategories,
  orderBookRows,
  type MarketCategory,
  type MarketItem,
} from '@/data/tradingFlow'
import type {
  AIInsight,
  Catalyst,
  MispricingAlert,
  NewsItem,
  ResolutionSource,
  Severity,
} from '@/types/aiStudio'

type FeatureMarket = Pick<
  MarketItem,
  'pair' | 'title' | 'category' | 'lastPrice' | 'change24h' | 'volume24h' | 'sparkline'
>

const parseMoney = (value: string) => {
  const num = parseFloat(value.replace(/[$,]/g, ''))
  if (Number.isNaN(num)) return 0
  if (value.includes('B')) return num * 1e9
  if (value.includes('M')) return num * 1e6
  if (value.includes('K')) return num * 1e3
  return num
}

const nowLabel = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

const severityFromScore = (score: number): Severity => {
  if (score >= 2.2) return 'high'
  if (score >= 1.3) return 'medium'
  return 'low'
}

export type MarketBriefData = {
  summary: AIInsight
  moversUp: FeatureMarket[]
  moversDown: FeatureMarket[]
  volumeLeaders: FeatureMarket[]
  keySignals: AIInsight[]
}

export const getMarketBriefData = (): MarketBriefData => {
  const movers = [...allMarkets].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
  const moversUp = movers.filter((m) => m.change24h > 0).slice(0, 3)
  const moversDown = movers.filter((m) => m.change24h < 0).slice(0, 3)
  const volumeLeaders = [...allMarkets]
    .sort((a, b) => parseMoney(b.volume24h) - parseMoney(a.volume24h))
    .slice(0, 6)

  const strongestMove = movers[0]
  const latestCandle = candlestickData[candlestickData.length - 1]

  const summary: AIInsight = {
    id: 'brief-summary',
    title: 'Market pulse',
    summary: `Momentum is concentrated in ${strongestMove.category} with ${strongestMove.pair} moving ${strongestMove.change24h >= 0 ? '+' : ''}${strongestMove.change24h.toFixed(1)}%. Latest microstructure candle closes at ${latestCandle.close.toFixed(2)} with elevated volume, signaling active repricing.`,
    confidence: 'high',
    updatedAt: nowLabel(),
  }

  const keySignals: AIInsight[] = [
    {
      id: 'signal-1',
      title: 'What happened',
      summary: `Top gainers are led by ${moversUp[0]?.pair ?? 'N/A'} while ${moversDown[0]?.pair ?? 'N/A'} remains the biggest downside outlier.`,
      confidence: 'high',
      updatedAt: summary.updatedAt,
    },
    {
      id: 'signal-2',
      title: 'Why it moved',
      summary: `Volume concentration sits in ${volumeLeaders.slice(0, 3).map((m) => m.pair).join(', ')}, amplifying directional conviction.`,
      confidence: 'medium',
      updatedAt: summary.updatedAt,
    },
    {
      id: 'signal-3',
      title: 'What to watch next',
      summary: `Watch widening dispersion between high-beta contracts and defensive macro names for possible cross-category rotation.`,
      confidence: 'medium',
      updatedAt: summary.updatedAt,
    },
  ]

  return { summary, moversUp, moversDown, volumeLeaders, keySignals }
}

type NewsSeed = {
  id: string
  headline: string
  source: string
  publishedAt: string
  keywords: string[]
  categoryBias?: MarketCategory
}

const NEWS_SEED: NewsSeed[] = [
  {
    id: 'news-1',
    headline: 'Fed officials signal rate-cut path may come earlier than expected',
    source: 'MacroWire',
    publishedAt: '5m ago',
    keywords: ['fed', 'rate', 'cut', 'economy', 'inflation'],
    categoryBias: 'Economy',
  },
  {
    id: 'news-2',
    headline: 'Bitcoin derivatives open interest spikes as BTC tests resistance',
    source: 'BlockScope',
    publishedAt: '11m ago',
    keywords: ['bitcoin', 'btc', 'crypto', 'derivatives'],
    categoryBias: 'Crypto',
  },
  {
    id: 'news-3',
    headline: 'Championship injury update shifts probabilities ahead of finals',
    source: 'SportsDesk',
    publishedAt: '20m ago',
    keywords: ['nba', 'championship', 'sport', 'finals'],
    categoryBias: 'Sports',
  },
  {
    id: 'news-4',
    headline: 'Election polling surprise tightens key race expectations',
    source: 'PolicyNow',
    publishedAt: '28m ago',
    keywords: ['election', 'poll', 'politics', 'government'],
    categoryBias: 'Politics',
  },
  {
    id: 'news-5',
    headline: 'AI milestone debate accelerates AGI timeline speculation',
    source: 'TechCurrent',
    publishedAt: '35m ago',
    keywords: ['agi', 'ai', 'tech', 'apple', 'tesla'],
    categoryBias: 'Science & Tech',
  },
  {
    id: 'news-6',
    headline: 'Streaming numbers beat estimates in blockbuster content release',
    source: 'MediaFlow',
    publishedAt: '44m ago',
    keywords: ['entertainment', 'spotify', 'oscar', 'views'],
    categoryBias: 'Entertainment',
  },
  {
    id: 'news-7',
    headline: 'Energy shock scenario revives recession hedge demand',
    source: 'GlobalPulse',
    publishedAt: '57m ago',
    keywords: ['oil', 'recession', 'economy', 'us'],
    categoryBias: 'Economy',
  },
  {
    id: 'news-8',
    headline: 'Social platform policy proposal triggers culture-war debate',
    source: 'SignalWatch',
    publishedAt: '1h ago',
    keywords: ['culture', 'threads', 'tiktok', 'users'],
    categoryBias: 'Culture',
  },
]

export type NewsMappingData = {
  items: NewsItem[]
  matchedMarketsByNews: Record<string, FeatureMarket[]>
}

export const getNewsMappingData = (category: MarketCategory | 'All' = 'All'): NewsMappingData => {
  const scopedMarkets =
    category === 'All' ? allMarkets : allMarkets.filter((market) => market.category === category)
  const matchedMarketsByNews: Record<string, FeatureMarket[]> = {}

  const items = NEWS_SEED.map((news) => {
    const matches = scopedMarkets
      .map((market) => {
        const haystack = `${market.title} ${market.pair} ${market.category}`.toLowerCase()
        const matchedKeywords = news.keywords.filter((keyword) => haystack.includes(keyword))
        const categoryBoost = news.categoryBias === market.category ? 1.25 : 1
        const score = matchedKeywords.length * categoryBoost
        return {
          market,
          score,
        }
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    matchedMarketsByNews[news.id] = matches.map((entry) => entry.market)
    const impactScore = Number(matches.reduce((sum, item) => sum + item.score, 0).toFixed(2))

    return {
      id: news.id,
      headline: news.headline,
      source: news.source,
      publishedAt: news.publishedAt,
      relatedMarkets: matches.map((entry) => entry.market.pair),
      impactScore,
    }
  })
    .sort((a, b) => b.impactScore - a.impactScore)

  return { items, matchedMarketsByNews }
}

export type CatalystsData = {
  catalysts: Catalyst[]
}

export const getCatalystsData = (marketId?: string): CatalystsData => {
  const sourceMarkets = marketId ? allMarkets.filter((m) => m.routeId === marketId) : allMarkets
  const topVolumeThreshold =
    [...allMarkets]
      .sort((a, b) => parseMoney(b.volume24h) - parseMoney(a.volume24h))
      .slice(0, Math.max(1, Math.round(allMarkets.length * 0.2)))
      .at(-1)?.volume24h ?? '$0'
  const topVolumeValue = parseMoney(topVolumeThreshold)

  const catalysts: Catalyst[] = []

  for (const market of sourceMarkets) {
    const absChange = Math.abs(market.change24h)
    const marketVolume = parseMoney(market.volume24h)
    const changeSignal = absChange / 4
    const volumeSignal = topVolumeValue > 0 ? marketVolume / topVolumeValue : 0

    if (absChange > 5 && marketVolume >= topVolumeValue) {
      catalysts.push({
        id: `${market.pair}-momentum`,
        marketPair: market.pair,
        type: 'price-momentum',
        description: `${market.pair} is repricing rapidly with ${market.change24h >= 0 ? '+' : ''}${market.change24h.toFixed(1)}% move on high turnover.`,
        severity: severityFromScore(changeSignal + volumeSignal),
        evidence: `24h change ${market.change24h.toFixed(1)}%, volume ${market.volume24h}.`,
        detectedAt: nowLabel(),
      })
    }

    if (marketVolume >= topVolumeValue) {
      catalysts.push({
        id: `${market.pair}-volume`,
        marketPair: market.pair,
        type: 'volume-spike',
        description: `${market.pair} entered top-liquidity bucket, often preceding sharper intraday swings.`,
        severity: severityFromScore(1 + volumeSignal),
        evidence: `Volume ranked in top 20% across all markets.`,
        detectedAt: nowLabel(),
      })
    }
  }

  const mapping = getNewsMappingData('All')
  for (const item of mapping.items.slice(0, 5)) {
    const pair = item.relatedMarkets[0]
    if (!pair) continue
    catalysts.push({
      id: `${item.id}-news`,
      marketPair: pair,
      type: 'news-driven',
      description: item.headline,
      severity: severityFromScore(item.impactScore / 2),
      evidence: `${item.source} • impact score ${item.impactScore.toFixed(2)}.`,
      detectedAt: nowLabel(),
    })
  }

  for (const event of eventTimeline.slice(0, 3)) {
    catalysts.push({
      id: `event-${event.minute}`,
      marketPair: 'BARCAWIN-USDT',
      type: 'event-driven',
      description: event.title,
      severity: 'medium',
      evidence: event.detail,
      detectedAt: `${event.minute} match time`,
    })
  }

  return {
    catalysts: catalysts.sort((a, b) => {
      const rank = { high: 3, medium: 2, low: 1 }
      return rank[b.severity] - rank[a.severity]
    }),
  }
}

export type MispricingData = {
  alerts: MispricingAlert[]
}

const getSpreadPct = () => {
  const bestAsk = parseFloat(orderBookRows.asks[0]?.price ?? '0')
  const bestBid = parseFloat(orderBookRows.bids[0]?.price ?? '0')
  const mid = (bestAsk + bestBid) / 2
  if (!mid) return 0
  return ((bestAsk - bestBid) / mid) * 100
}

export const getMispricingData = (category: MarketCategory | 'All' = 'All'): MispricingData => {
  const markets = category === 'All' ? allMarkets : allMarkets.filter((m) => m.category === category)
  const spreadPct = getSpreadPct()

  const statsByCategory = new Map<MarketCategory, { mean: number; std: number }>()
  for (const cat of marketCategories.filter((cat) => cat !== 'All')) {
    const catMarkets = allMarkets.filter((m) => m.category === cat)
    const mean = catMarkets.reduce((sum, market) => sum + market.lastPrice, 0) / catMarkets.length
    const variance =
      catMarkets.reduce((sum, market) => sum + (market.lastPrice - mean) ** 2, 0) / catMarkets.length
    statsByCategory.set(cat, {
      mean,
      std: Math.sqrt(variance) || 0.01,
    })
  }

  const alerts = markets.map<MispricingAlert>((market) => {
    const stat = statsByCategory.get(market.category) ?? { mean: market.lastPrice, std: 0.01 }
    const zScore = Math.abs((market.lastPrice - stat.mean) / stat.std)
    const severity = zScore > 2 ? 'high' : zScore > 1.2 ? 'medium' : 'low'
    const opportunity =
      severity === 'high'
        ? 'Large deviation from peers may offer reversion setup.'
        : severity === 'medium'
          ? 'Moderate dislocation relative to category pricing.'
          : 'Within normal range unless catalyst emerges.'

    return {
      id: `${market.pair}-mispricing`,
      marketPair: market.pair,
      marketTitle: market.title,
      spreadPct: Number(spreadPct.toFixed(2)),
      zScore: Number(zScore.toFixed(2)),
      severity,
      opportunity,
      riskNote: 'Low liquidity windows can keep dislocations open longer than expected.',
      volume24h: market.volume24h,
    }
  })

  return {
    alerts: alerts.sort((a, b) => b.zScore - a.zScore),
  }
}

export type ResolutionSourceData = {
  sources: ResolutionSource[]
}

const resolutionAuthorityByCategory: Record<Exclude<MarketCategory, 'All'>, string> = {
  Politics: 'Official election commission bulletins',
  Sports: 'Official league and federation match reports',
  Entertainment: 'Academy, charting and publisher announcements',
  Crypto: 'On-chain data providers and exchange settlement snapshots',
  'Science & Tech': 'Company filings and verified public releases',
  Economy: 'Central bank and government statistics portals',
  Culture: 'Platform transparency reports and audited usage data',
}

export const getResolutionSourceData = (marketPair?: string): ResolutionSourceData => {
  const scopedMarkets = marketPair ? allMarkets.filter((market) => market.pair === marketPair) : allMarkets

  const sources = scopedMarkets.slice(0, 12).map<ResolutionSource>((market, index) => {
    const trustLevel = index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'stale' : 'verified'
    return {
      marketPair: market.pair,
      primarySource: resolutionAuthorityByCategory[market.category],
      backupSource: 'Internal resolution committee review',
      resolutionRule: `Settle to YES at 1.00 if event conditions in ${market.title} are met before expiry, otherwise settle to NO at 0.00.`,
      lastVerifiedAt: `${index + 1}h ago`,
      trustLevel,
      history: [
        {
          date: 'Mar 10',
          change: 'Primary source scope validated against market wording.',
        },
        {
          date: 'Mar 08',
          change: 'Backup source adjusted to include secondary official bulletin.',
        },
        {
          date: 'Mar 03',
          change: 'Initial source mapping created at market listing.',
        },
      ],
    }
  })

  return { sources }
}
