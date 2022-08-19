import useSWR, { SWRResponse } from 'swr'
import type {
  HookSWRInput,
  HookFetchInput,
  HookFetcherOptions,
  HookFetcherFn,
  Fetcher,
  SwrOptions,
  SWRHookSchemaBase,
} from './types'
import defineProperty from './define-property'
import { CommerceError } from './errors'

export type ResponseState<Result> = SWRResponse<Result, CommerceError> & {
  isLoading: boolean
}

export type UseData = <H extends SWRHookSchemaBase>(
  options: {
    fetchOptions: HookFetcherOptions
    fetcher: HookFetcherFn<H>
  },
  input: HookFetchInput | HookSWRInput,
  fetcherFn: Fetcher,
  swrOptions?: SwrOptions<H['data'], H['fetcherInput']>
) => ResponseState<H['data']>

/*
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
console.log( Object.entries({
  a: 'somestring',
  b: 42
}))
// expected output:
Array [Array ["a", "somestring"], Array ["b", 42]]

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// expected output:
// "a: somestring"
// "b: 42"

*/

const useData: UseData = (options, input, fetcherFn, swrOptions) => {
  const hookInput = Array.isArray(input) ? input : Object.entries(input)
  // fetcher 宣言
  const fetcher = async (
    url: string,
    query?: string,
    method?: string,
    ...args: any[]
  ) => {
    try {
      //hook.fetcher({ input, options, fetch })
      return await options.fetcher({
        options: { url, query, method },
        // Transform the input array into an object
        input: args.reduce((obj, val, i) => {
          obj[hookInput[i][0]!] = val // hookInput[i][0] is key
          return obj
        }, {}),
        fetch: fetcherFn, // this is const fetcher: in fetcher.ts
      })
    } catch (error) {
      // SWR will not log errors, but any error that's not an instance
      // of CommerceError is not welcomed by this hook
      if (!(error instanceof CommerceError)) {
        console.error(error)
      }
      throw error
    }
  }
  console.log(
    'const useData: UseData = (options, input, fetcherFn, swrOptions)'
  )
  console.log(
    options.fetchOptions
      ? [
          options.fetchOptions.url,
          options.fetchOptions.query,
          options.fetchOptions.method,
          ...hookInput.map((e) => e[1]),
        ]
      : null
  ) // [undefined, 'customer', '_request']

  // pass multiple arguments (can be any value or object) to the fetcher function.
  // By default, key will be passed to fetcher as the argument.
  // const { data } = useSWR(['/api/post', queryParams], fetcher)
  // fetcher('/api/post', queryParqms) is invoked!!
  const response = useSWR(
    () => {
      const opts = options.fetchOptions // url: undefined, query: products, method: list
      return opts
        ? [opts.url, opts.query, opts.method, ...hookInput.map((e) => e[1])] //スプレッド構文で宣言された引数...hookInputはArray of object[{key1,value1},..], e[1]でvalueのみ抽出
        : null
    },
    fetcher,
    swrOptions
  )

  if (!('isLoading' in response)) {
    defineProperty(response, 'isLoading', {
      get() {
        return response.data === undefined
      },
      enumerable: true,
    })
  }

  console.log(response)
  console.log(response as typeof response & { isLoading: boolean })

  return response as typeof response & { isLoading: boolean }
}

/*
交差型 class、interface、object型を交差すると結合した型になる
type Hoge = {
  x: string;
};
type Fuga = {
  y: string;
};
let hogeAndFuga: Hoge & Fuga = { x: "x", y: "y" };


型キャストの書き方
let y = x as Hoge;
let y = <Hoge>x;
 */

export default useData
