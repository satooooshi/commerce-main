import { Fetcher } from '@vercel/commerce/utils/types'

export const fetcher: Fetcher = async () => {
  console.log('FETCHER')
  const res = await fetch('./data.json') // Fetch APIでファイルを読み込む
  if (res.ok) {
    const { data } = await res.json()
    return data
  }
  throw res
}
