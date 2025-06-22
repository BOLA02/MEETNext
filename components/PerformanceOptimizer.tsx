'use client'

import React, { Suspense, lazy, memo, useMemo, useCallback } from 'react'

// Lazy loading wrapper with loading fallback
export const LazyComponent = ({ 
  component: Component, 
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded" />,
  ...props 
}: {
  component: React.ComponentType<any>
  fallback?: React.ReactNode
  [key: string]: any
}) => {
  const LazyComponent = useMemo(() => lazy(() => Promise.resolve({ default: Component })), [Component])
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Memoized component wrapper
export const MemoizedComponent = memo(({ 
  children, 
  ...props 
}: { 
  children: React.ReactNode 
  [key: string]: any 
}) => {
  return <div {...props}>{children}</div>
})

// Performance optimized list renderer
export const OptimizedList = memo(({ 
  items, 
  renderItem, 
  keyExtractor,
  className = "space-y-2"
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  keyExtractor: (item: any, index: number) => string | number
  className?: string
}) => {
  const memoizedItems = useMemo(() => 
    items.map((item, index) => ({
      key: keyExtractor(item, index),
      element: renderItem(item, index)
    })), 
    [items, renderItem, keyExtractor]
  )

  return (
    <div className={className}>
      {memoizedItems.map(({ key, element }) => (
        <React.Fragment key={key}>
          {element}
        </React.Fragment>
      ))}
    </div>
  )
})

// Virtual scrolling for large lists (simplified version)
export const VirtualList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
  overscan?: number
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)
  
  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    })), 
    [items, startIndex, endIndex, itemHeight]
  )

  const totalHeight = items.length * itemHeight

  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
})

// Debounced input component
export const DebouncedInput = memo(({ 
  value, 
  onChange, 
  delay = 300,
  ...props 
}: {
  value: string
  onChange: (value: string) => void
  delay?: number
  [key: string]: any
}) => {
  const [localValue, setLocalValue] = React.useState(value)
  
  const debouncedOnChange = useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout
        return (newValue: string) => {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(() => onChange(newValue), delay)
        }
      },
      [onChange, delay]
    ),
    [onChange, delay]
  )

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    debouncedOnChange(newValue)
  }

  return <input {...props} value={localValue} onChange={handleChange} />
})

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [ref, setRef] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return [setRef, isIntersecting] as const
}

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = React.useRef(0)
  const lastRenderTime = React.useRef(performance.now())

  React.useEffect(() => {
    renderCount.current += 1
    const currentTime = performance.now()
    const timeSinceLastRender = currentTime - lastRenderTime.current
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times, ${timeSinceLastRender.toFixed(2)}ms since last render`)
    }
    
    lastRenderTime.current = currentTime
  })

  return { renderCount: renderCount.current }
}

// Image lazy loading component
export const LazyImage = memo(({ 
  src, 
  alt, 
  className = "",
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E",
  ...props 
}: {
  src: string
  alt: string
  className?: string
  placeholder?: string
  [key: string]: any
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  })

  React.useEffect(() => {
    if (isIntersecting && imageSrc === placeholder) {
      setImageSrc(src)
    }
  }, [isIntersecting, src, imageSrc, placeholder])

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      {...props}
    />
  )
})

// Optimized form component with debounced validation
export const OptimizedForm = memo(({ 
  children, 
  onSubmit,
  validate,
  ...props 
}: {
  children: React.ReactNode
  onSubmit: (data: any) => void
  validate?: (data: any) => any
  [key: string]: any
}) => {
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const debouncedValidate = useCallback(
    React.useMemo(
      () => {
        if (!validate) return () => ({})
        let timeoutId: NodeJS.Timeout
        return (data: any) => {
          clearTimeout(timeoutId)
          return new Promise((resolve) => {
            timeoutId = setTimeout(() => {
              const validationErrors = validate(data)
              setErrors(validationErrors)
              resolve(validationErrors)
            }, 300)
          })
        }
      },
      [validate]
    ),
    [validate]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const data = Object.fromEntries(formData)
      
      if (validate) {
        const validationErrors = await debouncedValidate(data)
        if (Object.keys(validationErrors).length > 0) {
          return
        }
      }
      
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
    </form>
  )
}) 