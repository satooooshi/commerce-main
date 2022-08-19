import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'
import { SearchProductsHook } from '@vercel/commerce/types/product'
import type { CommercejsProduct } from '../types/product'
import { getProductSearchVariables } from '../utils/product-search'
import { normalizeProduct } from '../utils/normalize-product'

// Genericsは抽象的な型引数を使用して、実際に利用されるまで型が確定しないクラス・関数・インターフェイスを実現する為に使用されます。
// useSearchをcommerce/src/product/use-search.tsxでジェネリック化, 複数の型引数を定義する,ジェネリクスの関数宣言
// 型はtypeof handlerで推論を利用
export default useSearch as UseSearch<typeof handler>

/*
https://zenn.dev/oreo2990/articles/65be8a24e842be
constアサーション as const
宣言と同時に型の拡大を制限(他の方を使わせない)することができる
型をreadonlyにできる
*/

export const handler: SWRHook<SearchProductsHook> = {
  // object 宣言
  fetchOptions: {
    query: 'products',
    method: 'list',
  },
  async fetcher({ input, options, fetch }) {
    console.log('(async fetcher{ input, options, fetch })')
    console.log({ input, options, fetch })
    const { data, meta } = await fetch<{
      data: CommercejsProduct[]
      meta: {
        pagination: {
          total: number
        }
      }
    }>({
      query: options.query,
      method: options.method,
      variables: getProductSearchVariables(input),
    })

    const formattedProducts =
      data?.map((product) => normalizeProduct(product)) || []

    return {
      products: formattedProducts,
      found: meta.pagination.total > 0,
    }
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      return useData({
        input: [
          ['search', input.search],
          ['categoryId', input.categoryId],
          ['brandId', input.brandId],
          ['sort', input.sort],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions, // スプレット演算子はobjectにも使える
        },
      })
    },
}

/*
// スプレット演算子はobjectにも使える
const x = { x: 1 };
const y = { y: 2 };
console.log({ ...x, ...y }); // {x: 1, y: 2}
*/
