import NextLink, { LinkProps as NextLinkProps } from 'next/link'

const Link: React.FC<NextLinkProps> = ({ href, children, ...props }) => {
  return (
    //  next/link （や react-router ) が提供する Link コンポーネントは、アプリ内のルーティング用
    // https:// で始まる外部リンクを出力したい場合は、<a> コンポーネントをそのまま使用します。<a href="https://example.com/" target="_blank" rel="noopener noreferrer">サイト名</a>リンククリック時に必ず別タブで開きたいときは、target="_blank" を指定
    <NextLink href={href}>
      <a {...props}>{children}</a>
    </NextLink>
  )
}

export default Link
