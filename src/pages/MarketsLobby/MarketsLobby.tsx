import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildTradeRoute } from '@/constants/routes'
import {
  allMarkets,
  lobbyStats,
  marketCategories,
  type MarketCategory,
  type MarketItem,
} from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

const MiniSparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const h = 28
  const w = 60
  const step = w / (data.length - 1)

  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={styles.sparklineSvg}>
      <polyline
        fill="none"
        stroke={positive ? '#22c55e' : '#ef4444'}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  )
}

const formatPrice = (price: number) => price.toFixed(2)
const formatChange = (change: number) => (change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`)

type SortKey = 'pair' | 'lastPrice' | 'change24h' | 'volume24h'
type SortDir = 'asc' | 'desc'

const parseVolume = (vol: string) => {
  const num = parseFloat(vol.replace(/[$,KMB]/g, ''))
  if (vol.includes('B')) return num * 1e9
  if (vol.includes('M')) return num * 1e6
  if (vol.includes('K')) return num * 1e3
  return num
}

const MarketsLobby = () => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('All')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('volume24h')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filteredMarkets = useMemo(() => {
    let list: MarketItem[] = allMarkets

    if (activeCategory !== 'All') {
      list = list.filter((m) => m.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (m) =>
          m.pair.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q),
      )
    }

    const sorted = [...list].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'pair':
          cmp = a.pair.localeCompare(b.pair)
          break
        case 'lastPrice':
          cmp = a.lastPrice - b.lastPrice
          break
        case 'change24h':
          cmp = a.change24h - b.change24h
          break
        case 'volume24h':
          cmp = parseVolume(a.volume24h) - parseVolume(b.volume24h)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return sorted
  }, [activeCategory, search, sortKey, sortDir])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allMarkets.length }
    for (const m of allMarkets) {
      counts[m.category] = (counts[m.category] || 0) + 1
    }
    return counts
  }, [])

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="View Portfolio" ctaTo={ROUTES.PORTFOLIO} />

      <div className={styles.shell}>
        {/* Stats ticker */}
        <section className={styles.statsGrid}>
          {lobbyStats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </section>

        {/* Market table panel */}
        <section className={styles.mktPanel}>
          {/* Category tabs */}
          <div className={styles.mktTabs}>
            {marketCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={activeCategory === cat ? styles.mktTabActive : styles.mktTab}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <span className={styles.mktTabCount}>{categoryCounts[cat] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className={styles.mktSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8fa0c7" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.mktSearchInput}
            />
          </div>

          {/* Table */}
          <div className={styles.mktTableWrap}>
            <table className={styles.mktTable}>
              <thead>
                <tr>
                  <th className={styles.mktTh} onClick={() => handleSort('pair')}>
                    Market{sortIndicator('pair')}
                  </th>
                  <th className={styles.mktThRight} onClick={() => handleSort('lastPrice')}>
                    Last Price{sortIndicator('lastPrice')}
                  </th>
                  <th className={styles.mktThRight} onClick={() => handleSort('change24h')}>
                    24h Change{sortIndicator('change24h')}
                  </th>
                  <th className={styles.mktThRight}>24h High</th>
                  <th className={styles.mktThRight}>24h Low</th>
                  <th className={styles.mktThRight} onClick={() => handleSort('volume24h')}>
                    24h Volume{sortIndicator('volume24h')}
                  </th>
                  <th className={styles.mktThRight}>Open Interest</th>
                  <th className={styles.mktThCenter}>Last 7 Prices</th>
                  <th className={styles.mktThCenter}>Trade</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarkets.map((m) => (
                  <tr key={m.pair} className={styles.mktRow}>
                    <td className={styles.mktTd}>
                      <div className={styles.mktPairCell}>
                        <span className={styles.mktPairName}>{m.pair}</span>
                        <span className={styles.mktPairTitle}>{m.title}</span>
                      </div>
                    </td>
                    <td className={styles.mktTdRight}>
                      <span className={styles.mktPrice}>{formatPrice(m.lastPrice)}</span>
                    </td>
                    <td className={styles.mktTdRight}>
                      <span className={m.change24h >= 0 ? styles.deltaUp : styles.deltaDown}>
                        {formatChange(m.change24h)}
                      </span>
                    </td>
                    <td className={styles.mktTdRight}>{formatPrice(m.high24h)}</td>
                    <td className={styles.mktTdRight}>{formatPrice(m.low24h)}</td>
                    <td className={styles.mktTdRight}>{m.volume24h}</td>
                    <td className={styles.mktTdRight}>{m.openInterest}</td>
                    <td className={styles.mktTdCenter}>
                      <MiniSparkline data={m.sparkline} positive={m.change24h >= 0} />
                    </td>
                    <td className={styles.mktTdCenter}>
                      <Link className={styles.mktTradeBtn} to={buildTradeRoute(m.routeId)}>
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMarkets.length === 0 && (
            <div className={styles.mktEmpty}>
              No markets found for &quot;{search}&quot;
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default MarketsLobby
