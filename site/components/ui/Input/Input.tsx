import cn from 'clsx'
import s from './Input.module.css'
import React, { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  onChange?: (...args: any[]) => any
}

// <Input placeholder="First Name" onChange={setFirstName} /> in SignUpView.tsx
const Input: React.FC<InputProps> = (props) => {
  const { className, children, onChange, ...rest } = props

  console.log('(s.root, {}, className)')
  console.log(s.root, {}, className)
  const rootClassName = cn(s.root, {}, className)

  const handleOnChange = (e: any) => {
    if (onChange) {
      // props中にonChangeがあるとき(onChangeがundefinedでないとき
      onChange(e.target.value)
    }
    return null
  }

  return (
    //<label>タグの指定方法には2つあり、1つは<label>タグのfor属性の値と、フォーム部品のid属性の値を同じにすることで両者の関連付けができます。
    //<label for="name1">名前</label><
    //input type="text" name="namae" id="name1">
    //もう一つは、<label>～</label>内に部品とラベルを配置するという方法です。
    <label>
      <input
        className={rootClassName}
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
    </label>
  )
}

export default Input
