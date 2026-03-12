import { getDebateRoomData } from '@/data/socialFeatures'
import styles from '@/styles/tradingFlow.module.scss'

const DebateRoom = () => {
  const data = getDebateRoomData()

  return (
    <div className={styles.socialFeatureStack}>
      <article className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIntro}>
            <h2>{data.marketTitle}</h2>
            <p className={styles.bodyCopy}>{data.roomPrompt}</p>
          </div>
          <div className={styles.buttonColumn}>
            <span className={styles.badge}>{data.marketTag}</span>
            <small className={styles.aiStudioMeta}>{data.resolutionDate}</small>
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
              <h2>Moderator summary</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            {data.moderatorNotes.map((note) => (
              <div key={note.title} className={styles.infoCard}>
                <div className={styles.socialFeatureCardTitle}>{note.title}</div>
                <p className={styles.aiFeatureDesc}>{note.summary}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Room format</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            <div className={styles.highlightCard}>
              <span>Focused threads</span>
              <strong>One market, two structured sides</strong>
              <p>Bull and bear arguments are separated so traders can compare conviction without losing the thread.</p>
            </div>
            <div className={styles.highlightCard}>
              <span>Evidence first</span>
              <strong>Every claim links back to catalysts</strong>
              <p>Posts are designed to anchor on data releases, news, and market moves instead of generic sentiment.</p>
            </div>
          </div>
        </article>
      </div>

      <div className={styles.debateRoomGrid}>
        <article className={styles.debateColumnBull}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Bull case</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            {data.bullCase.map((post) => (
              <div key={post.handle} className={styles.debatePostCard}>
                <div className={styles.debatePostMeta}>
                  <div>
                    <div className={styles.socialFeatureCardTitle}>{post.author}</div>
                    <div className={styles.leaderboardMeta}>
                      <span>{post.handle}</span>
                    </div>
                  </div>
                  <span className={styles.debateBullTag}>{post.conviction}</span>
                </div>
                <p className={styles.debatePostThesis}>{post.thesis}</p>
                <p className={styles.aiFeatureDesc}>{post.evidence}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.debateColumnBear}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <h2>Bear case</h2>
            </div>
          </div>

          <div className={styles.stackList}>
            {data.bearCase.map((post) => (
              <div key={post.handle} className={styles.debatePostCard}>
                <div className={styles.debatePostMeta}>
                  <div>
                    <div className={styles.socialFeatureCardTitle}>{post.author}</div>
                    <div className={styles.leaderboardMeta}>
                      <span>{post.handle}</span>
                    </div>
                  </div>
                  <span className={styles.debateBearTag}>{post.conviction}</span>
                </div>
                <p className={styles.debatePostThesis}>{post.thesis}</p>
                <p className={styles.aiFeatureDesc}>{post.evidence}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}

export default DebateRoom
