import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'

const Noop: FC = ({ children }) => <>{children}</>

/*
Next.jsではAppコンポーネントを使用して全てのページを初期化するようになっています。 
そのため、このコンポーネントを継承したクラスがあるファイル、_app.js(tsx) を作成することでデフォルトのAppコンポーネントを上書きできます。
*/
// pageProps はデータ取得メソッドの 1 つによってプリロードされた初期 props を持つオブジェクトです。
export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop
  console.log(pageProps)

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}
