import { serialize } from 'cookie'
import sdkFetcherFunction from '../../utils/sdk-fetch'
import { getDeploymentUrl } from '../../../utils/get-deployment-url'
import type { LoginEndpoint } from '.'

const login: LoginEndpoint['handlers']['login'] = async ({
  req,
  res,
  config: { sdkFetch, customerCookie },
}) => {
  // SSR cant be shown on the dev tool's console!!!
  // then  http://localhost:3000/api/login
  console.log('const login: LoginEndpoint[')
  console.log(
    JSON.stringify(
      {
        query: req.query,
        config: { sdkFetch, customerCookie },
      },
      null,
      2
    )
  )

  const sdkFetcher: typeof sdkFetcherFunction = sdkFetch
  const redirectUrl = getDeploymentUrl()
  try {
    const loginToken = req.query?.token as string
    //if (!loginToken) {
    //  res.redirect(redirectUrl)
    //}
    //const { jwt } = await sdkFetcher('customer', 'getToken', loginToken, false)
    const jwt = 'helloimjwt'
    res.setHeader(
      'Set-Cookie',
      serialize(customerCookie, jwt, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 2022-08-23T03:56:31.187Z
        path: '/',
      })
    )
    res.redirect(redirectUrl)
  } catch {
    res.redirect(redirectUrl)
  }
}

export default login
