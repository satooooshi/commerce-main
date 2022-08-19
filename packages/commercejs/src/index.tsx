import { commercejsProvider, CommercejsProvider } from './provider'
import {
  getCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@vercel/commerce'

export { commercejsProvider }
export type { CommercejsProvider }

// /site/components/common/Layout/Layout.tsxで使われる
// <CommerceProvider locale={locale}> <div... <main...
export const CommerceProvider = getCommerceProvider(commercejsProvider) // finally returns <Commerce.Provider value={cfg}>{children}</Commerce.Provider> in packages/commerce/src/index.tsx

// useHook():const { providerRef } = useCommerce<P>(), useFetcher():const { providerRef, fetcherRef } = useCommerce() in packages/src/utils/use-hook.tsx で使われる
export const useCommerce = () => useCoreCommerce()
