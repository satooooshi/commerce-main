import { commerce } from './lib/commercejs'
import type { Fetcher } from '@vercel/commerce/utils/types'
import { FetcherError } from '@vercel/commerce/utils/errors'

function isValidSDKQuery(query?: string): query is keyof typeof commerce {
  if (!query) return false
  return query in commerce
}

// Fetches from an API route within /api/endpoints directory
const customFetcher: Fetcher = async ({ method, url, body }) => {
  console.log(
    'const customFetcher: Fetcher = async ({ method, url, body }) => {'
  )
  console.log({ method, url, body })
  const response = await fetch(url!, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((response) => response.data)

  return response
}

const fetcher: Fetcher = async ({ url, query, method, variables, body }) => {
  var api_url: string | undefined
  // If a URL is passed, it means that the fetch needs to be passed on to a custom API route.
  if (method === 'login') {
    console.log('/commercejs/src/fetcher.ts:login')
    api_url = String(variables[1])
  } else console.log('/commercejs/src/fetcher.ts')
  console.log({ url, query, method, variables, body }) // undef products, list, und, und
  //const isCustomFetch = !!url // convert into true/false
  const isCustomFetch = !!api_url // convert into true/false
  if (isCustomFetch) {
    //const data = await customFetcher({ url, method, body })
    const data = await customFetcher({ url: api_url, method, body })
    return data
  }

  // Fetch using the Commerce.js SDK, but make sure that it's a valid method.
  if (!isValidSDKQuery(query)) {
    throw new FetcherError({
      errors: [
        { message: `Query ${query} does not exist on Commerce.js SDK.` },
      ],
      status: 400,
    })
  }

  const resource: any = commerce[query]

  if (!method || !resource[method]) {
    throw new FetcherError({
      errors: [
        {
          message: `Method ${method} does not exist on Commerce.js SDK ${query} resource.`,
        },
      ],
      status: 400,
    })
  }

  const variablesArgument = Array.isArray(variables) ? variables : [variables]
  const data = await resource[method](...variablesArgument)
  return data
}

export default fetcher
