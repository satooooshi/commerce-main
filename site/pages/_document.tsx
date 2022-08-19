import Document, { Head, Html, Main, NextScript } from 'next/document'

// Next.jsのページでは<html>や<body>などの基本的なマークアップはデフォルトで書かなくてよい設定になっています。
// もし全体の文書構造をカスタマイズしたいのならpages/_document.jsファイルで<Document>コンポーネントを拡張しましょう。

// _document.js(tsx)では、<Html>, <Head />, <Main />, <NextScript /> がページが適切にレンダリングするために必要となります。
// このHeadタグの中に<title> など、全ページ共通の設定を行います。
// SSR(サーバサイドレンダリング)のみの実行なので、クライアントサイドの処理を書くべきではありません。
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="loading">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
