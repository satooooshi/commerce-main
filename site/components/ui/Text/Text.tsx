import React, {
  FunctionComponent,
  JSXElementConstructor,
  CSSProperties,
} from 'react'
import cn from 'clsx'
import s from './Text.module.css'

interface TextProps {
  variant?: Variant
  className?: string
  style?: CSSProperties
  children?: React.ReactNode | any
  html?: string
  onClick?: () => any
}

type Variant = 'heading' | 'body' | 'pageHeading' | 'sectionHeading'

const Text: FunctionComponent<TextProps> = ({
  style,
  className = '',
  variant = 'body',
  children,
  html,
  onClick,
}) => {
  //
  //
  // カッコの位置注意！！

  // Use an index signature to define a type for an object with dynamic keys
  // https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
  const componentsMap: {
    // 宣言と定義同時
    [P in Variant]: React.ComponentType<any> | string
  } = {
    body: 'div',
    heading: 'h1',
    pageHeading: 'h1',
    sectionHeading: 'h2',
  }

  console.log('Text.tsx componentsMap![variant!]')
  console.log(componentsMap![variant!])

  const Component:
    | JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap![variant!] //div

  const htmlContentProps = html
    ? {
        dangerouslySetInnerHTML: { __html: html },
      }
    : {}

  return (
    <Component
      className={cn(
        s.root,
        {
          [s.body]: variant === 'body',
          [s.heading]: variant === 'heading',
          [s.pageHeading]: variant === 'pageHeading',
          [s.sectionHeading]: variant === 'sectionHeading',
        },
        className
      )}
      onClick={onClick}
      style={style}
      {...htmlContentProps} // { dangerouslySetInnerHTML: { __html: html },  } spread into dangerouslySetInnerHTML={{ __html: htmltext }}, or key:value --> key={value}
    >
      {children}
    </Component>
  )
}

export default Text
