import { Link } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { buildSocialFeatureRoute } from '@/constants/routes'
import { socialFeatures } from '@/data/social'
import styles from '@/styles/tradingFlow.module.scss'

const Social = () => {
  return (
    <div className={styles.page}>
      <TradingHeader />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>SOCIAL / COMPETITIVE</p>
            <h1 className={styles.title}>Compete, share, and learn from top traders</h1>
            <p className={styles.lead}>
              A social layer for trading where you can follow top traders, read public theses, copy
              watchlists, and join bull-vs-bear debates for each market.
            </p>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.aiFeatureGrid}>
            {socialFeatures.map((feature) => (
              <Link
                key={feature.id}
                to={buildSocialFeatureRoute(feature.id)}
                className={styles.aiFeatureCard}
              >
                <div className={styles.aiFeatureIcon}>{feature.icon}</div>
                <div>
                  <h3 className={styles.aiFeatureTitle}>{feature.title}</h3>
                  <p className={styles.aiFeatureDesc}>{feature.description}</p>
                </div>
                <span className={styles.aiFeatureBadge}>{feature.status}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Social
