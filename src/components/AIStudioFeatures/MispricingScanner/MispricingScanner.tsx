import { useMemo, useState } from 'react'
import { getMispricingData } from '@/data/aiStudioFeatures'
import { marketCategories, type MarketCategory } from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

type SortKey = 'zScore' | 'spreadPct' | 'marketPair'
type SortDir = 'asc' | 'desc'
type CategoryFilter = MarketCategory | 'All'

const categoryFilters: CategoryFilter[] = ['All', ...marketCategories.filter((item) => item !== 'All')]

const severityClass = (severity: 'high' | 'medium' | 'low') => {
  if (severity === 'high') return styles.aiStudioSeverityhigh
  if (severity === 'medium') return styles.aiStudioSeveritymedium
  return styles.aiStudioSeveritylow
}

const MispricingScanner = () => {
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [sortKey, setSortKey] = useState<SortKey>('zScore')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedId, setExpandedId] = useState('')

  const data = useMemo(() => getMispricingData(category), [category])

  const sortedAlerts = useMemo(() => {
    const list = [...data.alerts]
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'marketPair') cmp = a.marketPair.localeCompare(b.marketPair)
      if (sortKey === 'spreadPct') cmp = a.spreadPct - b.spreadPct
      if (sortKey === 'zScore') cmp = a.zScore - b.zScore
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [data.alerts, sortDir, sortKey])

  const flaggedCount = sortedAlerts.filter((item) => item.severity !== 'low').length
  const highCount = sortedAlerts.filter((item) => item.severity === 'high').length
  const avgSpread =
    sortedAlerts.reduce((sum, item) => sum + item.spreadPct, 0) / Math.max(sortedAlerts.length, 1)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDir('desc')
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className={styles.aiStudioFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Mispricing scanner</h2>
            <p className={styles.bodyCopy}>
              Detect contracts with unusual spread and category-relative valuation deviations.
            </p>
          </div>
        </div>

        <div className={styles.chipRow}>
          {categoryFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? styles.chipActive : styles.chip}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </article>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span>Flagged markets</span>
          <strong>{flaggedCount}</strong>
          <p>Out of {sortedAlerts.length} scanned contracts</p>
        </article>
        <article className={styles.statCard}>
          <span>High severity</span>
          <strong>{highCount}</strong>
          <p>Contracts with strongest deviation score</p>
        </article>
        <article className={styles.statCard}>
          <span>Average spread</span>
          <strong>{avgSpread.toFixed(2)}%</strong>
          <p>Computed from current top-of-book snapshot</p>
        </article>
      </section>

      <article className={styles.panel}>
        <div className={styles.mktTableWrap}>
          <table className={styles.mktTable}>
            <thead>
              <tr>
                <th className={styles.mktTh} onClick={() => handleSort('marketPair')}>
                  Market{sortIndicator('marketPair')}
                </th>
                <th className={styles.mktThRight}>24h Volume</th>
                <th className={styles.mktThRight} onClick={() => handleSort('spreadPct')}>
                  Spread % {sortIndicator('spreadPct')}
                </th>
                <th className={styles.mktThRight} onClick={() => handleSort('zScore')}>
                  Z-Score {sortIndicator('zScore')}
                </th>
                <th className={styles.mktTh}>Severity</th>
                <th className={styles.mktTh}>Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {sortedAlerts.map((alert) => (
                [
                  <tr
                    key={alert.id}
                    className={styles.mktRow}
                    onClick={() => setExpandedId((id) => (id === alert.id ? '' : alert.id))}
                  >
                    <td className={styles.mktTd}>
                      <div className={styles.mktPairCell}>
                        <span className={styles.mktPairName}>{alert.marketPair}</span>
                        <span className={styles.mktPairTitle}>{alert.marketTitle}</span>
                      </div>
                    </td>
                    <td className={styles.mktTdRight}>{alert.volume24h}</td>
                    <td className={styles.mktTdRight}>{alert.spreadPct.toFixed(2)}%</td>
                    <td className={styles.mktTdRight}>{alert.zScore.toFixed(2)}</td>
                    <td className={styles.mktTd}>
                      <span className={severityClass(alert.severity)}>{alert.severity}</span>
                    </td>
                    <td className={styles.mktTd}>{alert.opportunity}</td>
                  </tr>
                  ,
                  expandedId === alert.id ? (
                    <tr key={`${alert.id}-detail`} className={styles.aiStudioExpandedRow}>
                      <td colSpan={6} className={styles.mktTd}>
                        <strong>Risk note:</strong> {alert.riskNote}
                      </td>
                    </tr>
                  ) : null,
                ]
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

export default MispricingScanner
