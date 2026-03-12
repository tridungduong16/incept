import { useMemo, useState } from 'react'
import { getCatalystsData } from '@/data/aiStudioFeatures'
import type { Severity } from '@/types/aiStudio'
import styles from '@/styles/tradingFlow.module.scss'

type SeverityFilter = 'all' | Severity

const severityFilters: SeverityFilter[] = ['all', 'high', 'medium', 'low']

const severityClass = (severity: Severity) => {
  if (severity === 'high') return styles.aiStudioSeverityhigh
  if (severity === 'medium') return styles.aiStudioSeveritymedium
  return styles.aiStudioSeveritylow
}

const AutoCatalysts = () => {
  const [severity, setSeverity] = useState<SeverityFilter>('all')
  const [search, setSearch] = useState('')
  const data = useMemo(() => getCatalystsData(), [])

  const filtered = useMemo(() => {
    return data.catalysts.filter((catalyst) => {
      if (severity !== 'all' && catalyst.severity !== severity) return false
      if (!search.trim()) return true
      const query = search.toLowerCase()
      return (
        catalyst.marketPair.toLowerCase().includes(query) ||
        catalyst.description.toLowerCase().includes(query) ||
        catalyst.type.toLowerCase().includes(query)
      )
    })
  }, [data.catalysts, search, severity])

  return (
    <div className={styles.aiStudioFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Auto-generated catalysts</h2>
            <p className={styles.bodyCopy}>
              Rule-based engine that combines momentum, liquidity and headlines into ranked catalysts.
            </p>
          </div>
        </div>
        <div className={styles.aiStudioToolbar}>
          <div className={styles.chipRow}>
            {severityFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={severity === item ? styles.chipActive : styles.chip}
                onClick={() => setSeverity(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <input
            type="text"
            className={styles.mktSearchInput}
            placeholder="Filter by market or catalyst type"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.stackList}>
          {filtered.length > 0 ? (
            filtered.map((catalyst) => (
              <div key={catalyst.id} className={styles.infoCard}>
                <div className={styles.aiStudioRowBetween}>
                  <strong>{catalyst.marketPair}</strong>
                    <span className={severityClass(catalyst.severity)}>{catalyst.severity}</span>
                </div>
                <p className={styles.aiFeatureDesc}>{catalyst.description}</p>
                <div className={styles.inlineMeta}>
                  <span className={styles.aiFeatureBadge}>{catalyst.type}</span>
                  <span>{catalyst.evidence}</span>
                  <span>{catalyst.detectedAt}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.mktEmpty}>No catalysts match the current filters.</div>
          )}
        </div>
      </article>
    </div>
  )
}

export default AutoCatalysts
