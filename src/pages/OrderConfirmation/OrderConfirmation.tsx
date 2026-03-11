import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildEventRoute } from '@/constants/routes'
import { allMarkets } from '@/data/tradingFlow'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'
import {
  buildExecutionReplay,
  buildTradePreview,
  formatCurrency,
  isTradeOrderType,
  parseLadderParam,
  supportsLadder,
} from '@/utils/tradeTicket'

const OrderConfirmation = () => {
  const { eventId } = useParams()
  const [searchParams] = useSearchParams()
  const market = allMarkets.find((item) => item.routeId === eventId)

  if (!market) {
    return <NotFound />
  }

  const outcome = searchParams.get('outcome') === 'NO' ? 'NO' : 'YES'
  const basePrice = outcome === 'YES' ? market.lastPrice : parseFloat((1 - market.lastPrice).toFixed(2))
  const orderTypeParam = searchParams.get('type')
  const orderType = isTradeOrderType(orderTypeParam) ? orderTypeParam : 'Limit'
  const executionMode = searchParams.get('execution') === 'ladder' ? 'ladder' : 'single'
  const amountInput = searchParams.get('amount') ?? '100.00'
  const priceInput = searchParams.get('price') ?? basePrice.toFixed(2)
  const stopTrigger = searchParams.get('stop') ?? Math.max(0.01, basePrice - 0.05).toFixed(2)
  const takeProfitTrigger = searchParams.get('take') ?? Math.min(0.99, basePrice + 0.08).toFixed(2)
  const trailingOffset = searchParams.get('trail') ?? '0.03'
  const ladderLevels = parseLadderParam(searchParams.get('ladder'), basePrice)
  const ladderEnabled = supportsLadder(orderType) && executionMode === 'ladder'
  const preview = buildTradePreview({
    amountInput,
    priceInput,
    orderType,
    ladderEnabled,
    ladder: ladderLevels,
  })
  const replay = useMemo(
    () =>
      buildExecutionReplay({
        pair: market.pair,
        marketTitle: market.title,
        orderType,
        ladderEnabled,
        ladder: ladderLevels,
        preview,
      }),
    [ladderEnabled, ladderLevels, market.pair, market.title, orderType, preview],
  )
  const losingOutcome = outcome === 'YES' ? 'NO' : 'YES'
  const thesis = `${orderType} execution on ${market.pair} uses ${outcome} exposure with ${formatCurrency(preview.amount)} notional and targets price improvement without changing the event thesis.`

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Open Portfolio" ctaTo={ROUTES.PORTFOLIO} />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>Step 4</p>
            <h1 className={styles.title}>Confirm advanced order.</h1>
            <p className={styles.lead}>
              Review order type, ladder fills, expected P&amp;L and execution replay before the
              position is submitted to the portfolio.
            </p>
          </div>
        </section>

        <section className={styles.confirmGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Confirm</p>
              <h2>
                {market.pair} / Buy {outcome}
              </h2>
            </div>

            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Market</span>
                <strong>{market.title}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Order Type</span>
                <strong>{orderType}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Execution</span>
                <strong>{ladderEnabled ? 'Ladder' : 'Single Entry'}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Stake</span>
                <strong>{formatCurrency(preview.amount)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Average Entry</span>
                <strong>{preview.averageEntry.toFixed(2)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Quantity</span>
                <strong>{preview.estimatedShares.toLocaleString()} shares</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Fee</span>
                <strong>{formatCurrency(preview.fee)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Potential Payout</span>
                <strong>{formatCurrency(preview.potentialPayout)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Breakeven</span>
                <strong>{preview.breakevenPrice.toFixed(2)}</strong>
              </div>
            </div>

            {ladderEnabled && (
              <div className={styles.ocLadderPanel}>
                <strong>Position Ladder</strong>
                <div className={styles.ocLadderList}>
                  {ladderLevels.map((level) => (
                    <div key={level.id} className={styles.ocLadderRow}>
                      <span>{level.label}</span>
                      <span>{level.price}</span>
                      <span>{level.allocationPct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(orderType === 'Stop Loss' || orderType === 'OCO' || orderType === 'Take Profit' || orderType === 'Trailing Stop') && (
              <div className={styles.ocTriggerGrid}>
                {(orderType === 'Stop Loss' || orderType === 'OCO') && (
                  <div className={styles.infoCard}>
                    <strong>Stop trigger</strong>
                    <p>{stopTrigger}</p>
                  </div>
                )}
                {(orderType === 'Take Profit' || orderType === 'OCO') && (
                  <div className={styles.infoCard}>
                    <strong>Take profit</strong>
                    <p>{takeProfitTrigger}</p>
                  </div>
                )}
                {orderType === 'Trailing Stop' && (
                  <div className={styles.infoCard}>
                    <strong>Trailing offset</strong>
                    <p>{trailingOffset}</p>
                  </div>
                )}
              </div>
            )}

            <div className={styles.ocOutcomeGrid}>
              <article className={styles.infoCard}>
                <strong>If {outcome} resolves</strong>
                <p className={styles.deltaUp}>{formatCurrency(preview.netIfWin)} net after fees.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>If {losingOutcome} resolves</strong>
                <p className={styles.deltaDown}>{formatCurrency(preview.netIfLose)} net after fees.</p>
              </article>
            </div>

            <div className={styles.noticeStrong}>
              <strong>Trade thesis</strong>
              <p>{thesis}</p>
            </div>

            <div className={styles.buttonRow}>
              <Link className={styles.primaryButton} to={ROUTES.PORTFOLIO}>
                Confirm And Open Position
              </Link>
              <Link className={styles.secondaryButton} to={buildEventRoute(market.routeId)}>
                Back To Event
              </Link>
            </div>
          </article>

          <aside className={styles.panelAlt}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Risk Preview</p>
              <h2>Before the order goes live</h2>
            </div>

            <div className={styles.stackList}>
              <article className={styles.infoCard}>
                <strong>Max loss</strong>
                <p>{formatCurrency(preview.amount + preview.fee)} if {losingOutcome} resolves at settlement.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>Fee awareness</strong>
                <p>{formatCurrency(preview.fee)} is charged up front so realized P&amp;L matches execution.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>Replayable execution</strong>
                <p>Each fill step is logged so the user can inspect when and why the order matched.</p>
              </article>
            </div>

            <div className={styles.ocReplayPanel}>
              <div className={styles.tvObHeader}>
                <strong>Order History Replay</strong>
              </div>
              <div className={styles.ocReplayList}>
                {replay.map((step) => (
                  <div key={`${step.time}-${step.title}`} className={styles.ocReplayRow}>
                    <span className={styles.tvTimelineBadge}>{step.time}</span>
                    <div className={styles.ocReplayContent}>
                      <strong>{step.title}</strong>
                      <p>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default OrderConfirmation
