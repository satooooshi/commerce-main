const commerce = require('./commerce.config.json') // load enabled feature(cart, checkout, etc..)
const { withCommerceConfig, getProviderName } = require('./commerce-config')

const provider = commerce.provider || getProviderName()
const isBC = provider === '@vercel/commerce-bigcommerce'
const isShopify = provider === '@vercel/commerce-shopify'
const isSaleor = provider === '@vercel/commerce-saleor'
const isSwell = provider === '@vercel/commerce-swell'
const isVendure = provider === '@vercel/commerce-vendure'

// customize next.config.js by withCommerceConfig plugin
module.exports = withCommerceConfig({
  // pass object{...} as argument to function withCommerceConfig
  commerce,
  i18n: {
    // InternationalizatioN」のIとNの間に18文字あるので略してi18n, https://zenn.dev/yuyao17/articles/5cfa65d7e7eb11
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  // shp, rewrites:rewrites(){...}, rewrites()の定義をここで行う
  rewrites() {
    // Rewrites act as a URL proxy and mask the destination path, making it appear the user hasn't changed their location on the site.
    // In contrast, redirects will reroute to a new page and show the URL changes.
    return [
      (isBC || isShopify || isSwell || isVendure || isSaleor) && {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.
      isVendure &&
        process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL && {
          source: `${process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL}/:path*`,
          destination: `${process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL}/:path*`,
        },
    ].filter(Boolean)
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2)) // JSON.stringify(value[, replacer[, space]]), https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

//next.config.js は通常の Node.js モジュールであり JSON ファイルではありません。 Next.js サーバーとビルドフェーズで使用され、ブラウザのビルドには含まれません。
// https://nextjs-ja-translation-docs.vercel.app/docs/api-reference/next.config.js/introduction
