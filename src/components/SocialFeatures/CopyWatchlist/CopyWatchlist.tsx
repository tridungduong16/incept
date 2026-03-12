import { useState } from 'react'
import {
  getCopyWatchlistData,
  type CopiedWatchlistMarket,
  type CopyWatchlistMarket,
  type CopyWatchlistTrader,
} from '@/data/socialFeatures'
import styles from '@/styles/tradingFlow.module.scss'

const oddsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const CopyWatchlist = () => {
  const data = getCopyWatchlistData()
  const initialTrader = data.traders[0]

  const [selectedTraderId, setSelectedTraderId] = useState(initialTrader.id)
  const [searchValue, setSearchValue] = useState('')
  const [copyHighPriorityOnly, setCopyHighPriorityOnly] = useState(false)
  const [enableAlertsOnCopy, setEnableAlertsOnCopy] = useState(true)
  const [copiedMarkets, setCopiedMarkets] = useState<CopiedWatchlistMarket[]>(data.defaultCopiedMarkets)

  const getTraderById = (traderId: string): CopyWatchlistTrader =>
    data.traders.find((trader) => trader.id === traderId) ?? initialTrader

  const selectedTrader = getTraderById(selectedTraderId)

  const visibleMarkets = selectedTrader.markets.filter((market) => {
    const matchesSearch =
      market.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      market.category.toLowerCase().includes(searchValue.toLowerCase())
    const matchesPriority = !copyHighPriorityOnly || market.priority === 'High'

    return matchesSearch && matchesPriority
  })

  const overlapCount = visibleMarkets.filter((market) =>
    copiedMarkets.some((copiedMarket) => copiedMarket.id === market.id),
  ).length

  const handleCopyMarket = (market: CopyWatchlistMarket) => {
    setCopiedMarkets((current) => {
      if (current.some((copiedMarket) => copiedMarket.id === market.id)) {
        return current
      }

      return [
        {
          ...market,
          sourceTrader: selectedTrader.trader,
          alertsEnabled: enableAlertsOnCopy,
          addedAt: 'Synced just now',
        },
        ...current,
      ]
    })
  }

  const handleCopyVisibleMarkets = () => {
    setCopiedMarkets((current) => {
      const existingIds = new Set(current.map((market) => market.id))
      const nextMarkets = visibleMarkets
        .filter((market) => !existingIds.has(market.id))
        .map((market) => ({
          ...market,
          sourceTrader: selectedTrader.trader,
          alertsEnabled: enableAlertsOnCopy,
          addedAt: 'Synced just now',
        }))

      return [...nextMarkets, ...current]
    })
  }

  const handleClearTraderMarkets = () => {
    setCopiedMarkets((current) =>
      current.filter((market) => market.sourceTrader !== selectedTrader.trader),
    )
  }

  const handleRemoveMarket = (marketId: string) => {
    setCopiedMarkets((current) => current.filter((market) => market.id !== marketId))
  }

  const handleToggleAlerts = (marketId: string) => {
    setCopiedMarkets((current) =>
      current.map((market) =>
        market.id === marketId
          ? { ...market, alertsEnabled: !market.alertsEnabled }
          : market,
      ),
    )
  }

  return (
    <div className={styles.socialFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Copy watchlist workspace</h2>
            <p className={styles.bodyCopy}>
              Pull high-signal markets from trusted traders into your own watchlist, then keep only
              the names that still deserve attention.
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

      <div className={styles.socialFeatureDualGrid}>
        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Choose a source watchlist</h2>
            </div>
          </div>

          <div className={styles.marketTabs}>
            {data.traders.map((trader) => (
              <button
                key={trader.id}
                type="button"
                className={trader.id === selectedTraderId ? styles.marketTabActive : styles.marketTab}
                onClick={() => setSelectedTraderId(trader.id)}
              >
                <strong>{trader.trader}</strong>
                <span>{trader.specialty}</span>
                <small>
                  {trader.hitRate} hit rate
                  {' • '}
                  {trader.cadence}
                </small>
              </button>
            ))}
          </div>

          <div className={styles.notice}>
            <span>{selectedTrader.handle}</span>
            <span>{selectedTrader.followers} followers</span>
            <span>{selectedTrader.markets.length} active markets</span>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Sync controls</h2>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <span>Search source markets</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by market or category"
              className={styles.input}
            />
          </div>

          <div className={styles.stCardList}>
            <div className={styles.stCard}>
              <div className={styles.stCardLeft}>
                <strong>Copy only high-priority names</strong>
                <p>Filter out lower-conviction markets before you sync new ideas into your list.</p>
              </div>
              <button
                type="button"
                className={copyHighPriorityOnly ? styles.stToggleOn : styles.stToggleOff}
                onClick={() => setCopyHighPriorityOnly((current) => !current)}
                aria-pressed={copyHighPriorityOnly}
              >
                <span className={styles.stToggleKnob} />
              </button>
            </div>

            <div className={styles.stCard}>
              <div className={styles.stCardLeft}>
                <strong>Enable alerts on copied markets</strong>
                <p>New names arrive with notifications turned on so they stay on your radar.</p>
              </div>
              <button
                type="button"
                className={enableAlertsOnCopy ? styles.stToggleOn : styles.stToggleOff}
                onClick={() => setEnableAlertsOnCopy((current) => !current)}
                aria-pressed={enableAlertsOnCopy}
              >
                <span className={styles.stToggleKnob} />
              </button>
            </div>
          </div>

          <div className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <span>Visible source markets</span>
              <strong>{visibleMarkets.length}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Overlap already in your list</span>
              <strong>{overlapCount}</strong>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.primaryButton} onClick={handleCopyVisibleMarkets}>
              Copy visible markets
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleClearTraderMarkets}>
              Clear this source
            </button>
          </div>
        </article>
      </div>

      <div className={styles.socialFeatureDualGrid}>
        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>{selectedTrader.trader} watchlist</h2>
              <p className={styles.bodyCopy}>
                Copy individual markets or use the sync controls above to bring in the visible set.
              </p>
            </div>
          </div>

          <div className={styles.stackList}>
            {visibleMarkets.map((market) => {
              const isCopied = copiedMarkets.some((copiedMarket) => copiedMarket.id === market.id)

              return (
                <div key={market.id} className={styles.watchlistRow}>
                  <div>
                    <div className={styles.socialFeatureCardTitle}>{market.title}</div>
                    <div className={styles.leaderboardMeta}>
                      <span>{market.category}</span>
                      <span>{market.priority} priority</span>
                      <span>{market.addedAt}</span>
                    </div>
                    <p className={styles.aiFeatureDesc}>{market.thesis}</p>
                  </div>

                  <div className={styles.buttonColumn}>
                    <div className={styles.watchlistQuote}>
                      <span>{oddsFormatter.format(market.odds)}</span>
                      <small className={market.move24h >= 0 ? styles.deltaUp : styles.deltaDown}>
                        {market.move24h >= 0 ? '+' : ''}
                        {market.move24h}%
                      </small>
                    </div>

                    {isCopied ? (
                      <span className={styles.aiFeatureBadge}>Already copied</span>
                    ) : (
                      <button
                        type="button"
                        className={styles.stOutlineBtn}
                        onClick={() => handleCopyMarket(market)}
                      >
                        Copy market
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Your copied watchlist</h2>
              <p className={styles.bodyCopy}>
                Keep alerts on for live setups and remove copied names once they no longer matter.
              </p>
            </div>
          </div>

          {copiedMarkets.length > 0 ? (
            <div className={styles.stackList}>
              {copiedMarkets.map((market) => (
                <div key={market.id} className={styles.watchlistRow}>
                  <div>
                    <div className={styles.socialFeatureCardTitle}>{market.title}</div>
                    <div className={styles.leaderboardMeta}>
                      <span>{market.sourceTrader}</span>
                      <span>{market.category}</span>
                      <span>{market.addedAt}</span>
                    </div>
                    <p className={styles.aiFeatureDesc}>{market.thesis}</p>
                  </div>

                  <div className={styles.buttonColumn}>
                    <button
                      type="button"
                      className={market.alertsEnabled ? styles.stToggleOn : styles.stToggleOff}
                      onClick={() => handleToggleAlerts(market.id)}
                      aria-pressed={market.alertsEnabled}
                    >
                      <span className={styles.stToggleKnob} />
                    </button>
                    <button
                      type="button"
                      className={styles.stDeleteBtn}
                      onClick={() => handleRemoveMarket(market.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noticeStrong}>
              <strong>Your copied watchlist is empty.</strong>
              <p>Copy markets from the selected trader to start building a shared watchlist.</p>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default CopyWatchlist
