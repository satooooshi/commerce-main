/**
 * This file is expected to be used in next.config.js only
 */

const path = require('path')
const fs = require('fs')
const merge = require('deepmerge') // https://co.bsnws.net/article/160, 階層が複雑なオブジェクトでも、要素が問題なくマージされます。
const prettier = require('prettier')
const core = require('@vercel/commerce/config')

const PROVIDERS = [
  '@vercel/commerce-local',
  '@vercel/commerce-bigcommerce',
  '@vercel/commerce-saleor',
  '@vercel/commerce-shopify',
  '@vercel/commerce-swell',
  '@vercel/commerce-vendure',
  '@vercel/commerce-ordercloud',
  '@vercel/commerce-kibocommerce',
  '@vercel/commerce-spree',
  '@vercel/commerce-commercejs',
  '@vercel/commerce-sfcc',
]

function getProviderName() {
  return (
    process.env.COMMERCE_PROVIDER ||
    (process.env.BIGCOMMERCE_STOREFRONT_API_URL
      ? '@vercel/commerce-bigcommerce'
      : process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
      ? '@vercel/commerce-shopify'
      : process.env.NEXT_PUBLIC_SWELL_STORE_ID
      ? '@vercel/commerce-swell'
      : '@vercel/commerce-local') // if all undefined, return @vercel/commerce-local
  )
  //ex. return COMMERCE_PROVIDER=@vercel/commerce-commercejs in env.local
}

// setup application to use selected provider in env.local
function withCommerceConfig(nextConfig = {}) {
  const config = merge(
    { commerce: { provider: getProviderName() } },
    nextConfig
  )
  const { commerce } = config
  const { provider } = commerce

  if (!provider) {
    throw new Error(
      `The commerce provider is missing, please add a valid provider name or its environment variables`
    )
  }
  if (!PROVIDERS.includes(provider)) {
    throw new Error(
      `The commerce provider "${provider}" can't be found, please use one of "${PROVIDERS.join(
        ', '
      )}"`
    )
  }

  // Update paths in `tsconfig.json` to point to the selected provider
  // tsconfig.json中のpath keyvalueをselected providerへアップデート
  if (commerce.updateTSConfig !== false) {
    const tsconfigPath = path.join(
      process.cwd(),
      commerce.tsconfigPath || 'tsconfig.json'
    )
    console.log(`tsconfigPath: ${tsconfigPath}`)
    const tsconfig = require(tsconfigPath) // json object in tsconfigPath file is imported
    // The module path is a symlink in node_modules
    // -> /node_modules/[name]/dist/index.js
    // ex. provider: @vercel/commerce-commercejs
    // absolutePath: /commerce-main/packages/commercejs/dist/index.js
    // then node_molude is /commerce-main/node_modules/@vercel/commerce-commercejs/dist/index.js
    const absolutePath = require.resolve(provider) // require('hoge')で実際にどのファイルが読み込まれるのか調べたいときは, require.resolve('hoge'))とすれば絶対パスが表示される。
    console.log(`provider: ${provider}`)
    console.log(`process.cwd(): ${process.cwd()}`)
    console.log(`absolutePath: ${absolutePath}`)
    // but we want references to go to the real path in /packages instead
    // -> packages/[name]/dist
    const distPath = path.join(path.relative(process.cwd(), absolutePath), '..') // 第 1 引数が基準となるディレクトリー, ex. path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'); // ../../impl/bbb, '..'で結合後のpathから一つ親に戻った後srcに移動後のpathを表示(/dist/index.js -..-> /dist)
    console.log(`distPath: ${distPath}`)
    // -> /packages/[name]/src
    const modulePath = path.join(distPath, '../src') // '..'で結合後のpathから一つ親に戻った後srcに移動後のpathを表示
    console.log(`modulePath: ${modulePath}`)

    tsconfig.compilerOptions.paths['@framework'] = [`${modulePath}`]
    tsconfig.compilerOptions.paths['@framework/*'] = [`${modulePath}/*`]

    // fs.writeFileSync( 書き出すファイルパス , データ )
    fs.writeFileSync(
      tsconfigPath,
      prettier.format(JSON.stringify(tsconfig), { parser: 'json' })
    )

    const webpack = config.webpack

    // To improve the DX of using references, we'll switch from `src` to `dist`
    // only for webpack so imports resolve correctly but typechecking goes to `src`
    config.webpack = (cfg, options) => {
      if (Array.isArray(cfg.resolve.plugins)) {
        const jsconfigPaths = cfg.resolve.plugins.find(
          (plugin) => plugin.constructor.name === 'JsConfigPathsPlugin'
        )

        if (jsconfigPaths) {
          jsconfigPaths.paths['@framework'] = [distPath]
          jsconfigPaths.paths['@framework/*'] = [`${distPath}/*`]
        }
      }

      return webpack ? webpack(cfg, options) : cfg
    }
  }

  return core.withCommerceConfig(config)
}

module.exports = { withCommerceConfig, getProviderName }
