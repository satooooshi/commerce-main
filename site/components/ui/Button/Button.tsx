import cn from 'clsx' //Reactでクラス名を動的に設定するライブラリ https://qiita.com/taqm/items/c38855d8158cdd9d5a3e
import React, {
  forwardRef,
  ButtonHTMLAttributes,
  JSXElementConstructor,
  useRef,
} from 'react'
import mergeRefs from 'react-merge-refs'
import s from './Button.module.css'
import { LoadingDots } from '@components/ui'

/*
https://developer.mozilla.org/ja/docs/Web/API/HTMLButtonElement
HTMLButtonElement インターフェイスは、（通常の HTMLElement から継承によって利用できるものに加えて) <button> 要素を操作するためのプロパティやメソッドを提供します。

keyof typeof
https://zenn.dev/harryduck/articles/9d09b1c133f9cd
keyofとtypeofの併用 keyof typeofでオブジェクトからキーだけを抜き出して型を生成する

関数コンポーネントでは、Classコンポーネント時のref属性の代わりに、useRefを使って要素への参照を行います。
またuseRefでは、useStateのようにコンポーネント内での値を保持することが出来ます。
コンポーネントの再レンダリングはしたくないけど、内部に保持している値だけを更新したい場合は、保持したい値をuseStateではなく、useRefを利用するのが良さそうです。

forwardRefはコンポーネント内のDOMにRefオブジェクトを渡すための機能
https://ja.reactjs.org/docs/forwarding-refs.html


*/
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  className?: string
  variant?: 'flat' | 'slim' | 'ghost' | 'naked'
  active?: boolean
  type?: 'submit' | 'reset' | 'button'
  Component?: string | JSXElementConstructor<any>
  width?: string | number
  loading?: boolean
  disabled?: boolean
}

// eslint-disable-next-line react/display-name
const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
  // forwarded from <Button type="submit" width="100%" variant="ghost">
  console.log('props')
  console.log(props)
  console.log('buttonRef')
  console.log(buttonRef)
  // destructuring assignment
  // const { dogName = 'snickers' } = { dogName: undefined } // snickers
  // const { dogName = 'snickers' } = { dogName: null } // null
  const {
    className,
    variant = 'flat',
    children,
    active,
    width,
    loading = false,
    disabled = false,
    style = {},
    Component = 'button',
    ...rest
  } = props
  const ref = useRef<typeof Component>(null) // DOMを参照
  console.log('consta ref = useRef<typeof Component>(null)')
  console.log(ref) // current.accessKey='', etc. http://alphasis.info/2013/12/javascript-dom-button-accesskey/

  const rootClassName = cn(
    s.root, //shp
    {
      [s.ghost]: variant === 'ghost',
      [s.slim]: variant === 'slim',
      [s.naked]: variant === 'naked',
      [s.loading]: loading,
      [s.disabled]: disabled,
    },
    className
  )
  //ex. <div className="sticky z-20 bottom-0 w-full right-0 left-0 py-12 bg-accent-0 border-t border-accent-2 px-6"> にButton.modules.cssから.stickey, etcスタイルが適応される！！
  console.log('rootClassName')
  console.log(rootClassName) // Button_root__G_l9X Button_naked__xwcQp UserNav_item__Tv14Y

  return (
    <Component // Component = 'button',
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])} // <Button type="submit" width="100%" variant="ghost">
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {children}
      {loading && (
        <i className="pl-2 m-0 flex">
          <LoadingDots />
        </i>
      )}
    </Component>
  )
})

export default Button
