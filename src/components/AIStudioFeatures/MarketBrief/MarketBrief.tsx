import { useMemo, useState } from 'react'
import { getMarketBriefData } from '@/data/aiStudioFeatures'
import styles from '@/styles/tradingFlow.module.scss'

const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 72
  const height = 30
  const step = width / (data.length - 1)
  const points = data.map((value, idx) => `${idx * step},${height - ((value - min) / range) * height}`).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={styles.sparklineSvg}>
      <polyline
        fill="none"
        stroke={positive ? '#22c55e' : '#ef4444'}
        strokeWidth="1.6"
        points={points}
      />
    </svg>
  )
}

const MarketBrief = () => {
  const [refreshTick, setRefreshTick] = useState(0)
  const data = useMemo(() => getMarketBriefData(), [refreshTick])

  return (
    <div className={styles.aiStudioFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>{data.summary.title}</h2>
            <p className={styles.bodyCopy}>{data.summary.summary}</p>
          </div>
          <div className={styles.buttonColumn}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setRefreshTick((value) => value + 1)}
            >
              Refresh brief
            </button>
            <small className={styles.aiStudioMeta}>Updated at {data.summary.updatedAt}</small>
          </div>
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Top movers</h2>
          </div>
        </div>
        <div className={styles.aiStudioDualGrid}>
          <div className={styles.stackList}>
            <h3 className={styles.aiStudioSubheading}>Gainers</h3>
            {data.moversUp.map((market) => (
              <div key={market.pair} className={styles.infoCard}>
                <div className={styles.aiStudioRowBetween}>
                  <strong>{market.pair}</strong>
                  <span className={styles.deltaUp}>+{market.change24h.toFixed(1)}%</span>
                </div>
                <p className={styles.aiFeatureDesc}>{market.title}</p>
                <Sparkline data={market.sparkline} positive />
              </div>
            ))}
          </div>

          <div className={styles.stackList}>
            <h3 className={styles.aiStudioSubheading}>Losers</h3>
            {data.moversDown.map((market) => (
              <div key={market.pair} className={styles.infoCard}>
                <div className={styles.aiStudioRowBetween}>
                  <strong>{market.pair}</strong>
                  <span className={styles.deltaDown}>{market.change24h.toFixed(1)}%</span>
                </div>
                <p className={styles.aiFeatureDesc}>{market.title}</p>
                <Sparkline data={market.sparkline} positive={false} />
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Volume leaders</h2>
          </div>
        </div>
        <div className={styles.mktTableWrap}>
          <table className={styles.mktTable}>
            <thead>
              <tr>
                <th className={styles.mktTh}>Market</th>
                <th className={styles.mktThRight}>Price</th>
                <th className={styles.mktThRight}>24h Change</th>
                <th className={styles.mktThRight}>24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {data.volumeLeaders.map((market) => (
                <tr key={market.pair} className={styles.mktRow}>
                  <td className={styles.mktTd}>
                    <div className={styles.mktPairCell}>
                      <span className={styles.mktPairName}>{market.pair}</span>
                      <span className={styles.mktPairTitle}>{market.title}</span>
                    </div>
                  </td>
                  <td className={styles.mktTdRight}>{market.lastPrice.toFixed(2)}</td>
                  <td className={styles.mktTdRight}>
                    <span className={market.change24h >= 0 ? styles.deltaUp : styles.deltaDown}>
                      {market.change24h >= 0 ? '+' : ''}
                      {market.change24h.toFixed(1)}%
                    </span>
                  </td>
                  <td className={styles.mktTdRight}>{market.volume24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Key signals</h2>
          </div>
        </div>
        <div className={styles.stackList}>
          {data.keySignals.map((signal) => (
            <div key={signal.id} className={styles.infoCard}>
              <div className={styles.aiStudioRowBetween}>
                <strong>{signal.title}</strong>
                <span className={styles.aiFeatureBadge}>{signal.confidence} confidence</span>
              </div>
              <p className={styles.bodyCopy}>{signal.summary}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export default MarketBrief
