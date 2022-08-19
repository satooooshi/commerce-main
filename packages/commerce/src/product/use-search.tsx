import { useHook, useSWRHook } from '../utils/use-hook'
import { SWRFetcher } from '../utils/default-fetcher'
import type { HookFetcherFn, SWRHook } from '../utils/types'
import type { SearchProductsHook } from '../types/product'
import type { Provider } from '..'

export type UseSearch<
  H extends SWRHook<SearchProductsHook<any>> = SWRHook<SearchProductsHook>
> = ReturnType<H['useHook']>
// H is typeof handler
// useHook export default useSearch as UseSearch<typeof handler> in commercejs/src/product/use-search.tsx,
// ReturnType<H['useHook']> represents typeof useHook: ({ useData }) =>(...)

export const fetcher: HookFetcherFn<SearchProductsHook> = SWRFetcher //  fetcher({ options, fetch }) => fetch(options)

//関数定義（宣言ではない！！　）
// fnは引数provider、戻り値provider.products?.useSearch!である関数
const fn = (provider: Provider) => provider.products?.useSearch! // export const handler: SWRHook<SearchProductsHook> = {...}

const useSearch: UseSearch = (input) => {
  // 名前 (識別子) の型をコンパイラに伝えるのが宣言で、その名前が参照している実体 (メモリ) を確保するのが定義です。
  // useHook Object定義ではなく関数呼び出し！！ cf. new Greeter("Hello, ", "Taro"); (constructor)
  const hook = useHook(fn) // fn(provider)=>(...)という関数を引数として渡す
  //
  // {fetcher: fetcher, ..hook} // shp, spread op for object
  // hook containes fetcherOptions, fetcher, and useHook
  // 1st fetcher is overwritten to hook.fetcher!!
  return useSWRHook({ fetcher, ...hook })(input)
}

export default useSearch
