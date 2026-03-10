import { useState, type CSSProperties, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import heroBackground from '../../../background.png'
import brandLogo from '../../../logo.png'
import { ROUTES } from '@/constants/routes'
import { grantPlatformAccess } from '@/utils/platformAccess'
import styles from './Home.module.scss'

const markets = [
  {
    name: 'Fed Rate Cut',
    category: 'Macro',
    probability: 62,
    change: +3.2,
    volume: '$1.8M',
    traders: 2_841,
    trend: 'up' as const,
  },
  {
    name: 'BTC > $100k',
    category: 'Crypto',
    probability: 47,
    change: -1.4,
    volume: '$4.2M',
    traders: 5_102,
    trend: 'down' as const,
  },
  {
    name: 'US Election',
    category: 'Politics',
    probability: 54,
    change: +0.8,
    volume: '$12.6M',
    traders: 18_340,
    trend: 'up' as const,
  },
  {
    name: 'AI Regulation',
    category: 'Policy',
    probability: 39,
    change: -2.1,
    volume: '$920K',
    traders: 1_203,
    trend: 'down' as const,
  },
]

const leaderboard = [
  { rank: '01', trader: 'MacroSignal', markets: '128', pnl: '+$184,200', winRate: '71%' },
  { rank: '02', trader: 'DeltaDesk', markets: '104', pnl: '+$163,480', winRate: '68%' },
  { rank: '03', trader: 'PolicyEdge', markets: '96', pnl: '+$149,910', winRate: '66%' },
  { rank: '04', trader: 'VolSurface', markets: '82', pnl: '+$132,760', winRate: '64%' },
]

const orderBook = [
  { price: '0.49', size: '5,100' },
  { price: '0.48', size: '3,200' },
  { price: '0.47', size: '2,100' },
  { price: '0.46', size: '1,800' },
  { price: '0.45', size: '2,600' },
  { price: '0.44', size: '4,200' },
]

const chartCandles = [
  { time: '09:00', wickTop: '26%', wickHeight: '48%', bodyTop: '42%', bodyHeight: '18%', bullish: false },
  { time: '10:00', wickTop: '18%', wickHeight: '46%', bodyTop: '30%', bodyHeight: '20%', bullish: true },
  { time: '11:00', wickTop: '12%', wickHeight: '44%', bodyTop: '18%', bodyHeight: '24%', bullish: true },
  { time: '12:00', wickTop: '16%', wickHeight: '42%', bodyTop: '22%', bodyHeight: '18%', bullish: false },
  { time: '13:00', wickTop: '8%', wickHeight: '50%', bodyTop: '14%', bodyHeight: '28%', bullish: true },
  { time: '14:00', wickTop: '20%', wickHeight: '54%', bodyTop: '34%', bodyHeight: '20%', bullish: false },
]

const heroStyle = {
  '--hero-background-image': `url(${heroBackground})`,
} as CSSProperties

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const navigate = useNavigate()

  const handlePlatformLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    grantPlatformAccess()
    setIsLoginOpen(false)
    navigate(ROUTES.MARKETS)
  }

  return (
    <div className={styles.home}>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <a className={styles.brand} href="#top" aria-label="INCEPT home">
            <img className={styles.brandLogo} src={brandLogo} alt="" />
          </a>

          <nav className={styles.navLinks} aria-label="Primary">
            <a href="#markets">
              <span>Markets</span>
            </a>
            <a href="#leaderboard">
              <span>Leaderboard</span>
            </a>
            <a href="#what-is-incept">
              <span>Product</span>
            </a>
            <a href="#how-it-works">
              <span>How It Works</span>
            </a>
          </nav>

          <div className={styles.navActions}>
            <a className={styles.secondaryAction} href="#markets">
              View Markets
            </a>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => setIsLoginOpen(true)}
            >
              Start Trading
            </button>
          </div>
        </div>
      </header>

      <main id="top" className={styles.content}>
        <section className={styles.hero} style={heroStyle}>
          <div className={styles.heroCopy}>
            <h1>
              Trade Real-World
              <span> Probabilities</span>
            </h1>
            <p className={styles.heroText}>
              Prediction markets for
              <br />
              interest rates, elections, and more.
            </p>

            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.primaryAction}
                onClick={() => setIsLoginOpen(true)}
              >
                Start Trading
              </button>
              <a className={styles.secondaryAction} href="#markets">
                View Markets
              </a>
            </div>
          </div>
        </section>

        <section id="markets" className={styles.marketStripSection}>
          <div className={styles.sectionHeading}>
            <p>Markets</p>
            <h2>Trade live probabilities across macro, crypto, politics, and policy.</h2>
          </div>

          <div className={styles.marketStrip}>
            {markets.map((m) => (
              <article key={m.name} className={styles.marketStripCard}>
                <div className={styles.marketCardTop}>
                  <span className={styles.marketCategory}>{m.category}</span>
                  <span
                    className={`${styles.marketChange} ${m.trend === 'up' ? styles.marketUp : styles.marketDown}`}
                  >
                    {m.trend === 'up' ? '▲' : '▼'} {m.change > 0 ? '+' : ''}
                    {m.change}%
                  </span>
                </div>

                <h3 className={styles.marketName}>{m.name}</h3>

                <div className={styles.marketProbWrap}>
                  <strong className={styles.marketProb}>{m.probability}%</strong>
                  <div className={styles.marketBar}>
                    <div
                      className={`${styles.marketBarFill} ${m.probability >= 50 ? styles.marketBarBull : styles.marketBarBear}`}
                      style={{ width: `${m.probability}%` }}
                    />
                  </div>
                </div>

                <div className={styles.marketMeta}>
                  <div>
                    <span className={styles.marketMetaLabel}>Volume</span>
                    <span className={styles.marketMetaValue}>{m.volume}</span>
                  </div>
                  <div>
                    <span className={styles.marketMetaLabel}>Traders</span>
                    <span className={styles.marketMetaValue}>{m.traders.toLocaleString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="trade" className={styles.section}>
          <div className={styles.sectionHeading}>
            <p>Trade</p>
            <h2>Placeholder trading surface for live event positions.</h2>
          </div>

          <div className={styles.tradePreview}>
            <div className={styles.tradeMarketCard}>
              <div className={styles.tradeMarketHeader}>
                <span className={styles.tradeMarketTag}>Global Event</span>
                <div className={styles.tradeTeams}>
                  <div>
                    <span className={styles.tradeTeamCode}>FCB</span>
                    <strong>FC Barcelona vs Real Madrid CF</strong>
                  </div>
                  <span className={styles.tradeTeamCode}>RMA</span>
                </div>
              </div>

              <div className={styles.tradeProbabilityBlock}>
                <span>Barcelona Win Probability</span>
                <strong>0.4700</strong>
              </div>

              <div className={styles.tradeMetrics}>
                <article>
                  <strong>$2.3M</strong>
                  <span>Volume</span>
                </article>
                <article>
                  <strong>$4.8M</strong>
                  <span>Open Interest</span>
                </article>
                <article>
                  <strong>3,421</strong>
                  <span>Active Traders</span>
                </article>
                <article>
                  <strong>182</strong>
                  <span>Trades/min</span>
                </article>
              </div>

              <div className={styles.tradeSentiment}>
                <div>
                  <span>Buy Pressure</span>
                  <strong>68%</strong>
                </div>
                <p>Market Activity</p>
                <div>
                  <span>Sell Pressure</span>
                  <strong>32%</strong>
                </div>
              </div>
            </div>

            <div className={styles.tradeChartCard}>
              <div className={styles.tradeCardHeader}>
                <h3>Probability Chart</h3>
              </div>
              <div className={styles.tradeChartMeta}>
                <article>
                  <span>Current</span>
                  <strong>0.47</strong>
                </article>
                <article>
                  <span>High</span>
                  <strong>0.50</strong>
                </article>
                <article>
                  <span>Low</span>
                  <strong>0.45</strong>
                </article>
              </div>
              <div className={styles.tradeChartToolbar}>
                <div className={styles.tradeChartIntervals}>
                  <button type="button" className={styles.tradeChartIntervalActive}>
                    1H
                  </button>
                  <button type="button">4H</button>
                  <button type="button">1D</button>
                </div>
                <span className={styles.tradeChartLive}>Live</span>
              </div>
              <div className={styles.tradeChart}>
                <div className={styles.chartScale}>
                  <span>0.52</span>
                  <span>0.50</span>
                  <span>0.48</span>
                  <span>0.46</span>
                  <span>0.44</span>
                </div>
                <div className={styles.chartCanvas}>
                  <div className={styles.chartGrid} />
                  <div className={styles.chartPriceLine}>
                    <span>0.47</span>
                  </div>
                  <div className={styles.chartCandles}>
                    {chartCandles.map((candle) => (
                      <div key={candle.time} className={styles.chartCandleColumn}>
                        <div className={styles.chartCandleArea}>
                          <span
                            className={`${styles.chartCandleWick} ${candle.bullish ? styles.chartCandleBull : styles.chartCandleBear}`}
                            style={{ top: candle.wickTop, height: candle.wickHeight }}
                          />
                          <span
                            className={`${styles.chartCandleBody} ${candle.bullish ? styles.chartCandleBull : styles.chartCandleBear}`}
                            style={{ top: candle.bodyTop, height: candle.bodyHeight }}
                          />
                        </div>
                        <span className={styles.chartCandleTime}>{candle.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.tradeOrderCard}>
              <div className={styles.tradeCardHeader}>
                <h3>Order Book</h3>
              </div>
              <div className={styles.orderBookTable}>
                <div className={styles.orderBookHead}>
                  <span>Price</span>
                  <span>Size</span>
                </div>
                {orderBook.slice(0, 3).map((row) => (
                  <div key={row.price} className={`${styles.orderBookRow} ${styles.orderBookSell}`}>
                    <span>{row.price}</span>
                    <span>{row.size}</span>
                  </div>
                ))}
                <div className={styles.orderBookMid}>---- MID 0.47 ----</div>
                {orderBook.slice(3).map((row) => (
                  <div key={row.price} className={`${styles.orderBookRow} ${styles.orderBookBuy}`}>
                    <span>{row.price}</span>
                    <span>{row.size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tradePanelCard}>
              <div className={styles.tradeCardHeader}>
                <h3>Trade Panel</h3>
              </div>

              <div className={styles.tradeTabs}>
                <button type="button" className={styles.tradeTabActive}>
                  LONG
                </button>
                <button type="button">SHORT</button>
              </div>

              <div className={styles.leverageRow}>
                <span>Leverage</span>
                <div>
                  <button type="button">1x</button>
                  <button type="button">3x</button>
                  <button type="button">5x</button>
                  <button type="button">10x</button>
                </div>
              </div>

              <div className={styles.tradeInputs}>
                <p>Stop Loss / Take Profit</p>
                <div>
                  <label htmlFor="sl-price">SL Price</label>
                  <input id="sl-price" type="text" placeholder="0.4400" />
                </div>
                <div>
                  <label htmlFor="tp-price">TP Price</label>
                  <input id="tp-price" type="text" placeholder="0.5200" />
                </div>
              </div>

              <div className={styles.tradePanelActions}>
                <button type="button" className={styles.openLongButton}>
                  Open Long
                </button>
                <button type="button" className={styles.openShortButton}>
                  Open Short
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className={styles.section}>
          <div className={styles.sectionHeading}>
            <p>Leaderboard</p>
            <h2>Top traders ranked by performance across live event markets.</h2>
          </div>

          <div className={styles.leaderboardCard}>
            <div className={styles.leaderboardTableWrap}>
              <table className={styles.leaderboardTable}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Trader</th>
                    <th>Markets</th>
                    <th>P&amp;L</th>
                    <th>Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank}>
                      <td>{entry.rank}</td>
                      <td>{entry.trader}</td>
                      <td>{entry.markets}</td>
                      <td>{entry.pnl}</td>
                      <td>{entry.winRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="what-is-incept" className={styles.section}>
          <div className={styles.sectionHeading}>
            <p>What is INCEPT</p>
            <h2>Markets priced by information asymmetry, not narrative momentum.</h2>
          </div>
          <div className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <h3>Information Derivatives</h3>
              <p>
                Each market expresses the probability of a real-world event. The contract price becomes
                a live signal of collective belief.
              </p>
            </article>
            <article className={styles.infoCard}>
              <h3>Edge-driven participation</h3>
              <p>
                Research, domain expertise, and better interpretation of public signals become tradable
                advantage.
              </p>
            </article>
            <article className={styles.infoCard}>
              <h3>Clear resolution</h3>
              <p>
                Every event settles against an objective source, so outcomes are binary, auditable,
                and easy to understand.
              </p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className={styles.section}>
          <div className={styles.sectionHeading}>
            <p>How event trading works</p>
            <h2>Take a position on whether an event will happen before expiry.</h2>
          </div>
          <div className={styles.steps}>
            <article className={styles.stepCard}>
              <span>01</span>
              <h3>Choose a market</h3>
              <p>
                Select an event with a clear question and resolution date, from macro policy to
                sports, elections, or culture.
              </p>
            </article>
            <article className={styles.stepCard}>
              <span>02</span>
              <h3>Buy probability</h3>
              <p>
                Buy `YES` if you think the event will happen or `NO` if you think the market is
                mispriced in the other direction.
              </p>
            </article>
            <article className={styles.stepCard}>
              <span>03</span>
              <h3>Settle on truth</h3>
              <p>
                When the event resolves, winning shares settle to full payout and losing shares settle
                to zero.
              </p>
            </article>
          </div>
        </section>

        <section id="why-prediction-markets" className={styles.section}>
          <div className={styles.sectionHeading}>
            <p>Why prediction markets</p>
            <h2>They convert fragmented information into tradable probabilities.</h2>
          </div>
          <div className={styles.rationaleLayout}>
            <article className={styles.quoteCard}>
              <p>
                Pricing information as probability creates a sharper instrument than sentiment,
                headlines, or passive exposure.
              </p>
            </article>
            <div className={styles.reasons}>
              <article className={styles.reasonCard}>
                <h3>Faster price discovery</h3>
                <p>
                  Markets react to new evidence in real time, surfacing signal before slower
                  institutions update consensus.
                </p>
              </article>
              <article className={styles.reasonCard}>
                <h3>Aligned incentives</h3>
                <p>
                  Participants are rewarded for being correct, not for being loud, early, or popular.
                </p>
              </article>
              <article className={styles.reasonCard}>
                <h3>Actionable intelligence</h3>
                <p>
                  Probability curves give operators, investors, and analysts a direct way to interpret
                  uncertainty.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <p className={styles.eyebrow}>Ready to trade probability?</p>
            <h2>Turn your information edge into profit.</h2>
            <button
              type="button"
              className={styles.ctaButton}
              onClick={() => setIsLoginOpen(true)}
            >
              START TRADE
            </button>
          </div>
        </section>
      </main>

      {isLoginOpen ? (
        <div
          className={styles.loginModalOverlay}
          onClick={() => setIsLoginOpen(false)}
          role="presentation"
        >
          <div
            className={styles.loginModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <button
              type="button"
              className={styles.loginModalClose}
              onClick={() => setIsLoginOpen(false)}
              aria-label="Close login popup"
            >
              ×
            </button>

            <p className={styles.loginModalEyebrow}>Login</p>
            <h2 id="login-modal-title">Access INCEPT trading</h2>
            <p className={styles.loginModalText}>
              Sign in to open positions, track markets, and manage your orders.
            </p>

            <form className={styles.loginForm} onSubmit={handlePlatformLogin}>
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" placeholder="you@company.com" />

              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" placeholder="Enter password" />

              <button type="submit" className={styles.loginSubmitButton}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Home
