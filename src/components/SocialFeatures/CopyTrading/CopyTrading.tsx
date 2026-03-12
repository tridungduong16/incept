import { useState } from 'react'
import { getCopyTradingData, type CopyTradingTrader } from '@/data/socialFeatures'
import styles from '@/styles/tradingFlow.module.scss'

type LiveCopyState = {
  traderId: string
  allocation: number
  maxTradeUsd: number
  syncOpenPositions: boolean
  autoExit: boolean
  paused: boolean
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const allocationOptions = [10, 15, 20, 25, 40]
const maxTradeOptions = [250, 500, 750, 1000]

const CopyTrading = () => {
  const data = getCopyTradingData()
  const initialTrader = data.traders[0]

  const [selectedTraderId, setSelectedTraderId] = useState(initialTrader.id)
  const [allocation, setAllocation] = useState(initialTrader.defaultAllocation)
  const [maxTradeUsd, setMaxTradeUsd] = useState(initialTrader.defaultMaxTradeUsd)
  const [syncOpenPositions, setSyncOpenPositions] = useState(true)
  const [autoExit, setAutoExit] = useState(true)
  const [liveCopy, setLiveCopy] = useState<LiveCopyState>({
    traderId: initialTrader.id,
    allocation: initialTrader.defaultAllocation,
    maxTradeUsd: initialTrader.defaultMaxTradeUsd,
    syncOpenPositions: true,
    autoExit: true,
    paused: false,
  })

  const getTraderById = (traderId: string): CopyTradingTrader =>
    data.traders.find((trader) => trader.id === traderId) ?? initialTrader

  const selectedTrader = getTraderById(selectedTraderId)
  const liveTrader = getTraderById(liveCopy.traderId)

  const mirroredPositions = selectedTrader.positions.map((position) => {
    const uncappedSizeUsd = Math.round((position.leaderSizeUsd * allocation) / 100)
    const copiedSizeUsd = Math.min(uncappedSizeUsd, maxTradeUsd)
    const moveInPoints = (position.currentPrice - position.leaderPrice) * 100

    return {
      ...position,
      copiedSizeUsd,
      isCapped: copiedSizeUsd < uncappedSizeUsd,
      moveLabel: `${moveInPoints >= 0 ? '+' : ''}${moveInPoints.toFixed(1)} pts`,
    }
  })

  const estimatedExposure = mirroredPositions.reduce(
    (total, position) => total + position.copiedSizeUsd,
    0,
  )

  const handleTraderSelect = (trader: CopyTradingTrader) => {
    setSelectedTraderId(trader.id)
    setAllocation(trader.defaultAllocation)
    setMaxTradeUsd(trader.defaultMaxTradeUsd)
  }

  const handleActivateCopy = () => {
    setLiveCopy({
      traderId: selectedTrader.id,
      allocation,
      maxTradeUsd,
      syncOpenPositions,
      autoExit,
      paused: false,
    })
  }

  const handlePauseToggle = () => {
    setLiveCopy((current) => ({
      ...current,
      paused: !current.paused,
    }))
  }

  return (
    <div className={styles.socialFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Copy trading control center</h2>
            <p className={styles.bodyCopy}>
              Pick a trader, set your mirror size, and decide whether to sync open positions or only
              future entries.
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
              <h2>Choose a trader</h2>
            </div>
          </div>

          <div className={styles.marketTabs}>
            {data.traders.map((trader) => (
              <button
                key={trader.id}
                type="button"
                className={trader.id === selectedTraderId ? styles.marketTabActive : styles.marketTab}
                onClick={() => handleTraderSelect(trader)}
              >
                <strong>{trader.trader}</strong>
                <span>{trader.return30d}</span>
                <small>
                  {trader.strategy}
                  {' • '}
                  {trader.winRate} win rate
                </small>
              </button>
            ))}
          </div>

          <div className={styles.notice}>
            <span>{selectedTrader.handle}</span>
            <span>{selectedTrader.followers} followers</span>
            <span>{selectedTrader.averageHold} avg hold</span>
            <span>{selectedTrader.copyAum} copy AUM</span>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Mirror settings</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            <div className={styles.infoCard}>
              <div className={styles.socialFeatureCardTitle}>Portfolio allocation</div>
              <div className={styles.chipRow}>
                {allocationOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={allocation === value ? styles.chipActive : styles.chip}
                    onClick={() => setAllocation(value)}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.socialFeatureCardTitle}>Max trade size</div>
              <div className={styles.chipRow}>
                {maxTradeOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={maxTradeUsd === value ? styles.chipActive : styles.chip}
                    onClick={() => setMaxTradeUsd(value)}
                  >
                    {usdFormatter.format(value)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.stCardList}>
            <div className={styles.stCard}>
              <div className={styles.stCardLeft}>
                <strong>Sync open positions</strong>
                <p>Mirror the trader’s current book immediately when you activate copying.</p>
              </div>
              <button
                type="button"
                className={syncOpenPositions ? styles.stToggleOn : styles.stToggleOff}
                onClick={() => setSyncOpenPositions((current) => !current)}
                aria-pressed={syncOpenPositions}
              >
                <span className={styles.stToggleKnob} />
              </button>
            </div>

            <div className={styles.stCard}>
              <div className={styles.stCardLeft}>
                <strong>Auto-exit with trader</strong>
                <p>Close copied positions whenever the source trader reduces or exits the setup.</p>
              </div>
              <button
                type="button"
                className={autoExit ? styles.stToggleOn : styles.stToggleOff}
                onClick={() => setAutoExit((current) => !current)}
                aria-pressed={autoExit}
              >
                <span className={styles.stToggleKnob} />
              </button>
            </div>
          </div>

          <div className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <span>Projected mirrored exposure</span>
              <strong>{usdFormatter.format(estimatedExposure)}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Selected trader risk score</span>
              <strong>{selectedTrader.riskScore}</strong>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.primaryButton} onClick={handleActivateCopy}>
              {liveCopy.traderId === selectedTrader.id ? 'Update live copy' : 'Activate copy'}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handlePauseToggle}>
              {liveCopy.paused ? 'Resume live copy' : 'Pause live copy'}
            </button>
          </div>
        </article>
      </div>

      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Live copy status</h2>
          </div>
        </div>

        <div className={styles.noticeStrong}>
          <strong>
            {liveTrader.trader}
            {liveCopy.paused ? ' is paused in your account.' : ' is actively mirrored in your account.'}
          </strong>
          <p>
            Running at {liveCopy.allocation}% allocation with a per-trade cap of{' '}
            {usdFormatter.format(liveCopy.maxTradeUsd)}.{' '}
            {liveCopy.syncOpenPositions ? 'Open positions are synced.' : 'Only new entries are mirrored.'}{' '}
            {liveCopy.autoExit ? 'Exits stay linked to the source trader.' : 'Manual exits remain under your control.'}
          </p>
        </div>
      </article>

      <div className={styles.socialFeatureDualGrid}>
        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Mirrored positions preview</h2>
              <p className={styles.bodyCopy}>
                Preview what your copied book looks like before updating the live strategy.
              </p>
            </div>
          </div>

          <div className={styles.mktTableWrap}>
            <table className={styles.mktTable}>
              <thead>
                <tr>
                  <th className={styles.mktTh}>Market</th>
                  <th className={styles.mktThCenter}>Side</th>
                  <th className={styles.mktThRight}>Leader size</th>
                  <th className={styles.mktThRight}>Your size</th>
                  <th className={styles.mktThRight}>Current price</th>
                  <th className={styles.mktThRight}>Move</th>
                </tr>
              </thead>
              <tbody>
                {mirroredPositions.map((position) => (
                  <tr key={position.market} className={styles.mktRow}>
                    <td className={styles.mktTd}>
                      <div className={styles.socialFeatureCardTitle}>{position.market}</div>
                      <div className={styles.leaderboardMeta}>
                        <span>{position.conviction} conviction</span>
                        {position.isCapped ? <span>Capped by your limit</span> : <span>Inside your cap</span>}
                      </div>
                    </td>
                    <td className={styles.mktTdCenter}>
                      <span className={position.side === 'Yes' ? styles.deltaUp : styles.deltaDown}>
                        {position.side}
                      </span>
                    </td>
                    <td className={styles.mktTdRight}>{usdFormatter.format(position.leaderSizeUsd)}</td>
                    <td className={styles.mktTdRight}>{usdFormatter.format(position.copiedSizeUsd)}</td>
                    <td className={styles.mktTdRight}>{priceFormatter.format(position.currentPrice)}</td>
                    <td className={styles.mktTdRight}>
                      <span
                        className={position.moveLabel.startsWith('+') ? styles.deltaUp : styles.deltaDown}
                      >
                        {position.moveLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>{selectedTrader.trader} playbook</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            {selectedTrader.playbook.map((rule) => (
              <div key={rule} className={styles.highlightCard}>
                <span>{selectedTrader.strategy}</span>
                <strong>{selectedTrader.handle}</strong>
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}

export default CopyTrading
