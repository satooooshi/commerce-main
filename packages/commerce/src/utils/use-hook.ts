import { useCallback } from 'react'
import { Provider, useCommerce } from '..'
import type { MutationHook, PickRequired, SWRHook } from './types'
import useData from './use-data'

export function useFetcher() {
  const { providerRef, fetcherRef } = useCommerce()
  return providerRef.current.fetcher ?? fetcherRef.current // fetcherRef.current == async ({ url , query , method , variables , body })=> {…} in fetcher.ts
}

export function useHook<
  P extends Provider,
  H extends MutationHook<any> | SWRHook<any>
>(fn: (provider: P) => H) {
  //fn(provider)=>{}という関数を引数に取る
  const { providerRef } = useCommerce<P>()
  const provider = providerRef.current
  return fn(provider)
}

export function useSWRHook<H extends SWRHook<any>>(
  hook: PickRequired<H, 'fetcher'>
) {
  const fetcher = useFetcher()

  return hook.useHook({
    /*
    ctx is passed object 
    ctx =
    {
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
      }
     */
    useData(ctx) {
      const response = useData(hook, ctx?.input ?? [], fetcher, ctx?.swrOptions)
      return response
    },
  })
}

export function useMutationHook<H extends MutationHook<any>>(
  hook: PickRequired<H, 'fetcher'>
) {
  const fetcher = useFetcher()

  return hook.useHook({
    fetch: useCallback(
      ({ input } = {}) => {
        return hook.fetcher({
          input,
          options: hook.fetchOptions,
          fetch: fetcher,
        })
      },
      [fetcher, hook.fetchOptions]
    ),
  })
}
