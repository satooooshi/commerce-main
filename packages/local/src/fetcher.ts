import { Fetcher } from '@vercel/commerce/utils/types'

// Fetches from an API route within /api/endpoints directory
const customFetcher: Fetcher = async ({ method, url, body }) => {
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

// export default とexport constの違い
// ・export default Test1Component　→ default export import Test1Component from, import { default as sdkFetcher } from './fetcher' commercejs/provider.ts
// ・export const Test2Component 　→ named export, import { Test2Component } from, import { fetcher } from './fetcher' local/provider.ts
export const fetcher: Fetcher = async ({
  url,
  query,
  method,
  variables,
  body,
}) => {
  console.log('fetcher in fetcher.ts')
  console.log()
  const res = await fetch('./data.json') // Fetch APIでファイルを読み込む
  if (res.ok) {
    const { data } = await res.json()
    return data
  }
  throw res
}
