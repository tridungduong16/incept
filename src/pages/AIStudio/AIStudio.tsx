import TradingHeader from '@/components/TradingHeader'
import { buildAIStudioFeatureRoute } from '@/constants/routes'
import { aiStudioFeatures } from '@/data/aiStudio'
import { Link } from 'react-router-dom'
import styles from '@/styles/tradingFlow.module.scss'

const AIStudio = () => {
  return (
    <div className={styles.page}>
      <TradingHeader />

      <div className={styles.shell}>
        <section className={styles.sectionBlock}>
          <div className={styles.aiFeatureGrid}>
            {aiStudioFeatures.map((feature) => (
              <Link
                key={feature.id}
                to={buildAIStudioFeatureRoute(feature.id)}
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

export default AIStudio
