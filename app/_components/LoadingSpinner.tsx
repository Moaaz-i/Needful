'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  text = 'Loading...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12 md:h-16 md:w-16',
    lg: 'h-16 w-16 md:h-20 md:w-20'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm md:text-base',
    lg: 'text-base md:text-lg'
  }

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-rose-500 ${sizeClasses[size]}`}
      ></div>
      <p className={`text-slate-600 ${textSizes[size]} mobile-text`}>{text}</p>
    </div>
  )
}

interface LoadingCardProps {
  type?: 'product' | 'category' | 'brand' | 'cart'
  count?: number
  className?: string
}

export function LoadingCard({
  type = 'product',
  count = 1,
  className = ''
}: LoadingCardProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="animate-pulse h-[400px] flex flex-col">
            <div className="aspect-square bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl mb-4 shrink-0"></div>
            <div className="flex-1 flex flex-col">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mt-auto"></div>
            </div>
          </div>
        )

      case 'category':
        return (
          <div className="animate-pulse">
            <div className="h-64 w-full bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        )

      case 'brand':
        return (
          <div className="animate-pulse">
            <div className="h-40 w-full bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
          </div>
        )

      case 'cart':
        return (
          <div className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 items-center shadow-sm animate-pulse">
            <div className="h-24 w-24 rounded-lg bg-linear-to-br from-slate-200 to-slate-300 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-16"></div>
              <div className="h-8 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        )

      default:
        return (
          <div className="animate-pulse">
            <div className="h-32 w-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl"></div>
          </div>
        )
    }
  }

  if (count === 1) {
    return <div className={className}>{renderSkeleton()}</div>
  }

  return (
    <div
      className={`${className} grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6`}
    >
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

interface FullPageLoadingProps {
  text?: string
}

export function FullPageLoading({text = 'Loading...'}: FullPageLoadingProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="text-center mobile-card mobile-shadow-lg bg-white rounded-2xl p-8 max-w-sm w-full">
        <LoadingSpinner size="md" text={text} />
      </div>
    </div>
  )
}
