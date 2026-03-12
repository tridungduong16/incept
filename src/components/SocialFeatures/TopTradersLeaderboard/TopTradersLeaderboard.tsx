import { getTopTradersLeaderboardData } from '@/data/socialFeatures'
import styles from '@/styles/tradingFlow.module.scss'

const TopTradersLeaderboard = () => {
  const data = getTopTradersLeaderboardData()

  return (
    <div className={styles.socialFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Leaderboard overview</h2>
            <p className={styles.bodyCopy}>
              Track the best-performing traders across live event markets and compare who is delivering the
              strongest risk-adjusted returns right now.
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
              <h2>How ranking works</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            {data.rankingRules.map((rule) => (
              <div key={rule.title} className={styles.infoCard}>
                <div className={styles.socialFeatureCardTitle}>{rule.title}</div>
                <p className={styles.aiFeatureDesc}>{rule.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Trader spotlight</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            {data.spotlight.map((item) => (
              <div key={item.trader} className={styles.highlightCard}>
                <span>{item.edge}</span>
                <strong>{item.trader}</strong>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>Top traders leaderboard</h2>
            <p className={styles.bodyCopy}>
              Ranked by 30-day P&amp;L, win rate, consistency, and a Sharpe-like score built for prediction markets.
            </p>
          </div>
        </div>

        <div className={styles.mktTableWrap}>
          <table className={styles.mktTable}>
            <thead>
              <tr>
                <th className={styles.mktTh}>Trader</th>
                <th className={styles.mktThRight}>P&amp;L</th>
                <th className={styles.mktThRight}>Win rate</th>
                <th className={styles.mktThRight}>Risk score</th>
                <th className={styles.mktThRight}>Markets</th>
                <th className={styles.mktThRight}>Followers</th>
                <th className={styles.mktTh}>Top market</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry) => (
                <tr key={entry.handle} className={styles.mktRow}>
                  <td className={styles.mktTd}>
                    <div className={styles.leaderboardTraderCell}>
                      <span className={styles.leaderboardRank}>#{entry.rank}</span>
                      <div>
                        <div className={styles.socialFeatureCardTitle}>{entry.trader}</div>
                        <div className={styles.leaderboardMeta}>
                          <span>{entry.handle}</span>
                          <span>{entry.streak}</span>
                        </div>
                        <p className={styles.leaderboardThesis}>{entry.thesis}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.mktTdRight}>
                    <span className={styles.deltaUp}>{entry.pnl}</span>
                  </td>
                  <td className={styles.mktTdRight}>{entry.winRate}</td>
                  <td className={styles.mktTdRight}>{entry.sharpeLike}</td>
                  <td className={styles.mktTdRight}>{entry.markets}</td>
                  <td className={styles.mktTdRight}>{entry.followers}</td>
                  <td className={styles.mktTd}>
                    <span className={styles.badge}>{entry.topMarket}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

export default TopTradersLeaderboard
