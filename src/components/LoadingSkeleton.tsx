import clsx from 'clsx'

type LoadingSkeletonProps = {
  className?: string
}

const LoadingSkeleton = ({ className }: LoadingSkeletonProps) => {
  return <div aria-hidden="true" className={clsx('skeletonBlock', className)} />
}

export default LoadingSkeleton
