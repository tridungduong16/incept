import { useState } from 'react'
import {
  getCommunityConsensusData,
  type CommunityConsensusMarket,
  type CommunityConsensusTimeframe,
} from '@/data/socialFeatures'
import styles from '@/styles/tradingFlow.module.scss'

const CommunityConsensus = () => {
  const data = getCommunityConsensusData()

  const [selectedTimeframe, setSelectedTimeframe] = useState<CommunityConsensusTimeframe>('24h')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchValue, setSearchValue] = useState('')
  const [trackedMarketIds, setTrackedMarketIds] = useState<Set<string>>(new Set())

  const categories = data.categories

  const filteredMarkets = data.markets.filter((market) => {
    const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory
    const matchesSearch =
      market.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      market.category.toLowerCase().includes(searchValue.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleToggleTrack = (marketId: string) => {
    setTrackedMarketIds((prev) => {
      const next = new Set(prev)
      if (next.has(marketId)) {
        next.delete(marketId)
      } else {
        next.add(marketId)
      }
      return next
    })
  }

  return (
    <div className={styles.socialFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Community consensus</h2>
            <p className={styles.bodyCopy}>
              See how the community is positioned across markets. Bull, bear, and neutral sentiment
              are aggregated from open positions and recent activity.
            </p>
          </div>
        </div>

        <div className={styles.leaderboardOverviewGrid}>
          {data.overview.map((item) => (
            <div key={item.label} className={styles.statCard}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Consensus by market</h2>
            <p className={styles.bodyCopy}>
              Each bar reflects the community’s bullish vs bearish lean for that market. Use the
              timeframe to see how sentiment has shifted.
            </p>
          </div>
        </div>

        <div className={styles.mktTabs}>
          {data.timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              className={tf === selectedTimeframe ? styles.mktTabActive : styles.mktTab}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf === '24h' ? '24 hours' : tf === '7d' ? '7 days' : '30 days'}
            </button>
          ))}
        </div>

        <div className={styles.mktSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search markets"
            className={styles.mktSearchInput}
          />
        </div>

        <div className={styles.chipRow} style={{ marginBottom: 16 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cat === selectedCategory ? styles.chipActive : styles.chip}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.stackList}>
          {filteredMarkets.map((market) => (
            <ConsensusMarketRow
              key={market.id}
              market={market}
              isTracked={trackedMarketIds.has(market.id)}
              onToggleTrack={() => handleToggleTrack(market.id)}
            />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className={styles.mktEmpty}>
            No markets match your filters. Try a different category or search term.
          </div>
        )}
      </article>

      {trackedMarketIds.size > 0 && (
        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Tracked markets ({trackedMarketIds.size})</h2>
              <p className={styles.bodyCopy}>
                Markets you’re following for consensus shifts. Remove when no longer needed.
              </p>
            </div>
          </div>

          <div className={styles.stackList}>
            {data.markets
              .filter((market) => trackedMarketIds.has(market.id))
              .map((market) => (
                <ConsensusMarketRow
                  key={market.id}
                  market={market}
                  isTracked
                  onToggleTrack={() => handleToggleTrack(market.id)}
                />
              ))}
          </div>
        </article>
      )}
    </div>
  )
}

type ConsensusMarketRowProps = {
  market: CommunityConsensusMarket
  isTracked: boolean
  onToggleTrack: () => void
}

const ConsensusMarketRow = ({ market, isTracked, onToggleTrack }: ConsensusMarketRowProps) => {
  const bullPct = market.bullPct
  const bearPct = market.bearPct
  const neutralPct = market.neutralPct
  const total = bullPct + bearPct + neutralPct
  const bullWidth = total > 0 ? (bullPct / total) * 100 : 0
  const bearWidth = total > 0 ? (bearPct / total) * 100 : 0
  const neutralWidth = total > 0 ? (neutralPct / total) * 100 : 0

  return (
    <div className={styles.watchlistRow}>
      <div>
        <div className={styles.socialFeatureCardTitle}>{market.title}</div>
        <div className={styles.leaderboardMeta}>
          <span>{market.category}</span>
          <span>{market.participants} participants</span>
          <span className={market.shift24h >= 0 ? styles.deltaUp : styles.deltaDown}>
            {market.shift24h >= 0 ? '+' : ''}
            {market.shift24h}% bull lean vs 24h ago
          </span>
        </div>
      </div>

      <div className={styles.buttonColumn}>
        <div style={{ width: 200 }}>
          <div
            style={{
              display: 'flex',
              height: 12,
              borderRadius: 6,
              overflow: 'hidden',
              marginBottom: 6,
            }}
          >
            {bullWidth > 0 && (
              <div
                style={{
                  width: `${bullWidth}%`,
                  minWidth: bullWidth > 0 ? 4 : 0,
                  background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.4))',
                }}
              />
            )}
            {neutralWidth > 0 && (
              <div
                style={{
                  width: `${neutralWidth}%`,
                  minWidth: neutralWidth > 0 ? 4 : 0,
                  background: 'rgba(255, 255, 255, 0.12)',
                }}
              />
            )}
            {bearWidth > 0 && (
              <div
                style={{
                  width: `${bearWidth}%`,
                  minWidth: bearWidth > 0 ? 4 : 0,
                  background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.9), rgba(239, 68, 68, 0.4))',
                }}
              />
            )}
          </div>
          <div className={styles.leaderboardMeta} style={{ fontSize: '0.72rem' }}>
            <span className={styles.deltaUp}>{bullPct}% bull</span>
            <span>{neutralPct}% neutral</span>
            <span className={styles.deltaDown}>{bearPct}% bear</span>
          </div>
        </div>

        <button
          type="button"
          className={isTracked ? styles.chipActive : styles.chip}
          onClick={onToggleTrack}
        >
          {isTracked ? 'Untrack' : 'Track'}
        </button>
      </div>
    </div>
  )
}

export default CommunityConsensus
