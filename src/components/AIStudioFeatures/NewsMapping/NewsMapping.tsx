import { useEffect, useMemo, useState } from 'react'
import { getNewsMappingData } from '@/data/aiStudioFeatures'
import { marketCategories, type MarketCategory } from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

const categories: Array<MarketCategory | 'All'> = ['All', ...marketCategories.filter((item) => item !== 'All')]

const NewsMapping = () => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory | 'All'>('All')
  const data = useMemo(() => getNewsMappingData(activeCategory), [activeCategory])
  const [selectedNewsId, setSelectedNewsId] = useState<string>(data.items[0]?.id ?? '')

  useEffect(() => {
    setSelectedNewsId(data.items[0]?.id ?? '')
  }, [data.items])

  const selectedNews = data.items.find((item) => item.id === selectedNewsId) ?? data.items[0]
  const relatedMarkets = selectedNews ? data.matchedMarketsByNews[selectedNews.id] ?? [] : []

  return (
    <div className={styles.aiStudioFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>News-to-market mapping</h2>
            <p className={styles.bodyCopy}>
              Map breaking headlines to contracts with the highest potential pricing impact.
            </p>
          </div>
        </div>
        <div className={styles.chipRow}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? styles.chipActive : styles.chip}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </article>

      <section className={styles.aiStudioFeatureTwoCol}>
        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>News timeline</h2>
            </div>
          </div>
          <div className={styles.stackList}>
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === selectedNews?.id ? styles.aiStudioNewsCardActive : styles.aiStudioNewsCard}
                onClick={() => setSelectedNewsId(item.id)}
              >
                <div className={styles.aiStudioRowBetween}>
                  <strong>{item.source}</strong>
                  <span className={styles.aiFeatureBadge}>{item.publishedAt}</span>
                </div>
                <p className={styles.aiFeatureDesc}>{item.headline}</p>
                <small className={styles.aiStudioMeta}>Impact score: {item.impactScore.toFixed(2)}</small>
              </button>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Related markets</h2>
              <p className={styles.aiFeatureDesc}>
                {selectedNews ? selectedNews.headline : 'Select a headline to view related contracts.'}
              </p>
            </div>
          </div>
          <div className={styles.stackList}>
            {relatedMarkets.length > 0 ? (
              relatedMarkets.map((market) => (
                <div key={market.pair} className={styles.infoCard}>
                  <div className={styles.aiStudioRowBetween}>
                    <strong>{market.pair}</strong>
                    <span className={market.change24h >= 0 ? styles.deltaUp : styles.deltaDown}>
                      {market.change24h >= 0 ? '+' : ''}
                      {market.change24h.toFixed(1)}%
                    </span>
                  </div>
                  <p className={styles.aiFeatureDesc}>{market.title}</p>
                  <div className={styles.inlineMeta}>
                    <span>{market.category}</span>
                    <span>{market.volume24h} volume</span>
                    <span>Last {market.lastPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.mktEmpty}>No matching markets found</div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

export default NewsMapping
