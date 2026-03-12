import { useEffect, useMemo, useState } from 'react'
import { getResolutionSourceData } from '@/data/aiStudioFeatures'
import styles from '@/styles/tradingFlow.module.scss'

const trustClass = (trust: 'verified' | 'pending' | 'stale') => {
  if (trust === 'verified') return styles.aiStudioTrustverified
  if (trust === 'pending') return styles.aiStudioTrustpending
  return styles.aiStudioTruststale
}

const ResolutionTracker = () => {
  const [search, setSearch] = useState('')
  const data = useMemo(() => getResolutionSourceData(), [])

  const filteredSources = useMemo(() => {
    if (!search.trim()) return data.sources
    const query = search.toLowerCase()
    return data.sources.filter(
      (source) =>
        source.marketPair.toLowerCase().includes(query) ||
        source.primarySource.toLowerCase().includes(query),
    )
  }, [data.sources, search])

  const [selectedPair, setSelectedPair] = useState(filteredSources[0]?.marketPair ?? '')
  const selected = filteredSources.find((item) => item.marketPair === selectedPair) ?? filteredSources[0]

  useEffect(() => {
    if (filteredSources.length === 0) {
      setSelectedPair('')
      return
    }
    const exists = filteredSources.some((item) => item.marketPair === selectedPair)
    if (!exists) setSelectedPair(filteredSources[0].marketPair)
  }, [filteredSources, selectedPair])

  return (
    <div className={styles.aiStudioFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Resolution source tracker</h2>
            <p className={styles.bodyCopy}>
              Track settlement data sources and history updates to improve trust and transparency.
            </p>
          </div>
        </div>
        <div className={styles.mktSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8fa0c7" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by market pair or source"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.mktSearchInput}
          />
        </div>
      </article>

      <section className={styles.aiStudioFeatureTwoCol}>
        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Markets</h2>
            </div>
          </div>
          <div className={styles.stackList}>
            {filteredSources.length > 0 ? (
              filteredSources.map((source) => (
                <button
                  key={source.marketPair}
                  type="button"
                  className={
                    source.marketPair === selected?.marketPair
                      ? styles.aiStudioNewsCardActive
                      : styles.aiStudioNewsCard
                  }
                  onClick={() => setSelectedPair(source.marketPair)}
                >
                  <div className={styles.aiStudioRowBetween}>
                    <strong>{source.marketPair}</strong>
                    <span className={trustClass(source.trustLevel)}>{source.trustLevel}</span>
                  </div>
                  <small className={styles.aiStudioMeta}>{source.lastVerifiedAt}</small>
                </button>
              ))
            ) : (
              <div className={styles.mktEmpty}>No markets found.</div>
            )}
          </div>
        </article>

        <article className={styles.panel}>
          {selected ? (
            <div className={styles.stackList}>
              <div className={styles.infoCard}>
                <div className={styles.aiStudioRowBetween}>
                  <strong>{selected.marketPair}</strong>
                  <span className={trustClass(selected.trustLevel)}>{selected.trustLevel}</span>
                </div>
                <p className={styles.aiFeatureDesc}>
                  <strong>Primary:</strong> {selected.primarySource}
                </p>
                <p className={styles.aiFeatureDesc}>
                  <strong>Backup:</strong> {selected.backupSource}
                </p>
                <p className={styles.bodyCopy}>{selected.resolutionRule}</p>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.aiStudioSubheading}>Change history</h3>
                <div className={styles.stackList}>
                  {selected.history.map((item) => (
                    <div key={`${selected.marketPair}-${item.date}-${item.change}`} className={styles.timelineItem}>
                      <span>{item.date}</span>
                      <div>
                        <strong>Source update</strong>
                        <p>{item.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.mktEmpty}>Select a market to view resolution details.</div>
          )}
        </article>
      </section>
    </div>
  )
}

export default ResolutionTracker
