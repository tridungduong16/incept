import { Link, useParams } from 'react-router-dom'
import { socialFeatureRegistry } from '@/components/SocialFeatures'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES } from '@/constants/routes'
import { getSocialFeatureById } from '@/data/social'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'

const SocialFeature = () => {
  const { featureId } = useParams()

  if (!featureId) {
    return <NotFound />
  }

  const feature = getSocialFeatureById(featureId)

  if (!feature) {
    return <NotFound />
  }

  const FeatureContent = socialFeatureRegistry[featureId]

  return (
    <div className={styles.page}>
      <TradingHeader />

      <div className={styles.shell}>
        <section className={styles.sectionBlock}>
          {FeatureContent ? (
            <FeatureContent />
          ) : (
            <article className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIntro}>
                  <h2>What this feature provides</h2>
                </div>
              </div>

              <div className={styles.stackList}>
                {feature.highlights.map((highlight) => (
                  <div key={highlight} className={styles.infoCard}>
                    <p className={styles.bodyCopy}>{highlight}</p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  )
}

export default SocialFeature
