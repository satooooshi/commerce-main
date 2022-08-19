import React, { CSSProperties } from 'react'
import cn from 'clsx'
import px from '@lib/to-pixels'
import s from './Skeleton.module.css'

interface SkeletonProps {
  show?: boolean
  block?: boolean
  className?: string
  style?: CSSProperties
  width?: string | number
  height?: string | number
  boxHeight?: string | number
}

//例えばDBからフェッチをしてくる文言や画像、広告などは読み込まれるまでに時間がかかりますが、それのプレイスホルダーのようなものです。
//InstagramやTwitterで読み込み中に出てくるものというのがわかりやすいでしょうか。
// in Search.tsx
// <Skeleton key={i}>
const Skeleton: React.FC<SkeletonProps> = ({
  style,
  width,
  height,
  children,
  className,
  show = true,
  boxHeight = height,
}) => {
  // Automatically calculate the size if there are children
  // and no fixed sizes are specified
  const shouldAutoSize = !!children && !(width || height)

  // !(width || height) --> false || falseのみで true !!

  // Defaults
  width = width || 24
  height = height || 24
  boxHeight = boxHeight || height

  return (
    <span
      className={cn(s.skeleton, className, {
        [s.show]: show,
        [s.wrapper]: shouldAutoSize,
        [s.loaded]: !shouldAutoSize && !!children,
      })}
      style={
        // AutoSizeしたい時のみ適応される
        shouldAutoSize
          ? {}
          : {
              minWidth: px(width),
              minHeight: px(height),
              marginBottom: `calc(${px(boxHeight)} - ${px(height)})`,
              ...style,
            }
      }
    >
      {children}
    </span>
  )
}

export default Skeleton
