import type { ComponentType } from 'react'
import AutoCatalysts from './AutoCatalysts'
import MarketBrief from './MarketBrief'
import MispricingScanner from './MispricingScanner'
import NewsMapping from './NewsMapping'
import ResolutionTracker from './ResolutionTracker'

export const featureRegistry: Record<string, ComponentType> = {
  'market-brief': MarketBrief,
  'news-mapping': NewsMapping,
  'auto-catalysts': AutoCatalysts,
  'mispricing-scanner': MispricingScanner,
  'resolution-tracker': ResolutionTracker,
}

export { AutoCatalysts, MarketBrief, MispricingScanner, NewsMapping, ResolutionTracker }
