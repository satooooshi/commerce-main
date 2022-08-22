import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'
export default useSearch as UseSearch<typeof handler>

/*
実装DIY
引数は一つ下の階層まで含める、
argument, propertyは同じ名前！！ OR { options: aa, input, fetch } options is renamed into aa
*/
export const handlera: SWRHook<any> = {
  useHook:
    ({ useData }) =>
    (input) => {},
  fetchOptions: { method: undefined, query: '', url: undefined },
  fetcher: async ({ options: aa, input, fetch }) => {}, //any | Promise<any]>
}

export const handler: SWRHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher({ input, options, fetch }) {
    console.log('(async fetcher{ input, options, fetch })')
    console.log({ input, options, fetch })
    const { data, meta } = await fetch<{
      data: any
      meta: {
        pagination: {
          total: number
        }
      }
    }>({
      query: options.query,
      method: options.method,
      variables: 'hello',
    })

    return {
      products: undefined,
      found: meta.pagination.total > 0,
    }
  },
  /*
  async fetcher({ input, options, fetch }) {
    console.log('Local: (async fetcher{ input, options, fetch })')
    console.log({ input, options, fetch })
  },
  */
  useHook:
    ({ useData }) =>
    (input = {}) => {
      console.log('useHook:')
      console.log('inputa:')
      console.log(input)

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
  /*
  useHook: () => () => {
    return {
      data: {
        products: [],
      },
    }
  },
  */
}
