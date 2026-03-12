export type AIStudioFeatureStatus = 'Active' | 'Coming Soon'

export type AIStudioFeature = {
  id: string
  icon: string
  title: string
  shortLabel: string
  description: string
  status: AIStudioFeatureStatus
  highlights: string[]
}

export const aiStudioFeatures: AIStudioFeature[] = [
  {
    id: 'market-brief',
    icon: 'AI',
    title: 'AI Market Brief',
    shortLabel: 'Market Brief',
    description: 'Tom tat vi sao gia vua bien dong de trader hieu nhanh dong luc thi truong.',
    status: 'Active',
    highlights: [
      'Tong hop nhanh cac bien dong gia dang dien ra.',
      'Rut gon tin hieu tu volume, spread, va order flow.',
      'Giup trader co context truoc khi vao lenh.',
    ],
  },
  {
    id: 'news-mapping',
    icon: 'NEWS',
    title: 'News-to-market mapping',
    shortLabel: 'News Mapping',
    description: 'Gan tin tuc lien quan truc tiep vao tung market de nhin ro tac dong thoi gian thuc.',
    status: 'Active',
    highlights: [
      'Link tin nong voi market co lien quan.',
      'Nhac cac headline co kha nang tao bien dong.',
      'Theo doi tuong quan giua news va gia theo thoi gian.',
    ],
  },
  {
    id: 'auto-catalysts',
    icon: 'CAT',
    title: 'Auto-generated catalysts',
    shortLabel: 'Catalysts',
    description: 'He thong tu dong liet ke cac yeu to co kha nang day gia cho moi market.',
    status: 'Active',
    highlights: [
      'Tu dong xac dinh su kien co kha nang tac dong gia.',
      'Phan loai catalyst theo muc do uu tien.',
      'Cap nhat danh sach catalyst theo live market data.',
    ],
  },
  {
    id: 'mispricing-scanner',
    icon: 'SCAN',
    title: 'Mispricing scanner',
    shortLabel: 'Mispricing',
    description: 'Goi y market volume cao nhung spread hoac lech gia bat thuong de san co hoi.',
    status: 'Active',
    highlights: [
      'Phat hien market co spread bat thuong.',
      'So sanh lech gia voi thanh khoan hien tai.',
      'Uu tien alert cho market co volume lon.',
    ],
  },
  {
    id: 'resolution-tracker',
    icon: 'SRC',
    title: 'Resolution source tracker',
    shortLabel: 'Resolution Source',
    description: 'Hien thi nguon du lieu dung de settle market, tang tinh minh bach va trust.',
    status: 'Active',
    highlights: [
      'Cong khai nguon du lieu settle cho tung market.',
      'Luu vet cap nhat va thay doi resolution source.',
      'Tang trust qua co che settle minh bach.',
    ],
  },
]

export const getAIStudioFeatureById = (featureId: string) =>
  aiStudioFeatures.find((feature) => feature.id === featureId)
