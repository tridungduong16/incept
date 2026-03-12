export type SocialFeatureStatus = 'Active' | 'Coming Soon'

export type SocialFeature = {
  id: string
  icon: string
  title: string
  shortLabel: string
  description: string
  status: SocialFeatureStatus
  highlights: string[]
}

export const socialFeatures: SocialFeature[] = [
  {
    id: 'leaderboard',
    icon: 'TOP',
    title: 'Top traders leaderboard',
    shortLabel: 'Leaderboard',
    description: 'Xep hang trader theo P&L, win rate, va Sharpe-like score.',
    status: 'Active',
    highlights: [
      'Bang xep hang theo P&L thoi gian thuc.',
      'So sanh win rate va consistency giua cac trader.',
      'Them Sharpe-like score de danh gia rui ro-loi nhuan.',
    ],
  },
  {
    id: 'public-theses',
    icon: 'THESIS',
    title: 'Public theses',
    shortLabel: 'Theses',
    description: 'Nguoi dung chia se reasoning cua minh cho tung market cu the.',
    status: 'Coming Soon',
    highlights: [
      'Doc luan diem bull/bear tu trader khac.',
      'Theo doi lich su cap nhat thesis theo market.',
      'So sanh thesis voi bien dong gia sau su kien.',
    ],
  },
  {
    id: 'copy-watchlist',
    icon: 'COPY',
    title: 'Copy watchlist',
    shortLabel: 'Watchlist',
    description: 'Follow danh sach market cua trader khac de kham pha co hoi nhanh hon.',
    status: 'Coming Soon',
    highlights: [
      'Copy watchlist tu trader ban tin tuong.',
      'Nhan cap nhat khi watchlist co market moi.',
      'Danh dau market trung lap de toi uu theo doi.',
    ],
  },
  {
    id: 'community-consensus',
    icon: 'CONSENSUS',
    title: 'Community consensus',
    shortLabel: 'Consensus',
    description: 'Tong hop bias hien tai cua cong dong theo tung market.',
    status: 'Coming Soon',
    highlights: [
      'Do luong xu huong bullish va bearish cua cong dong.',
      'Tong hop sentiment theo tung market/event.',
      'Theo doi su dich chuyen bias theo thoi gian.',
    ],
  },
  {
    id: 'debate-room',
    icon: 'DEBATE',
    title: 'Debate room',
    shortLabel: 'Debate',
    description: 'Khong gian thao luan bull vs bear cho tung event cu the.',
    status: 'Coming Soon',
    highlights: [
      'Phong tranh luan theo tung event market.',
      'Tach ro lap luan bull va bear de de theo doi.',
      'Tich hop context tin tuc va du lieu gia vao tranh luan.',
    ],
  },
]

export const getSocialFeatureById = (featureId: string) =>
  socialFeatures.find((feature) => feature.id === featureId)
