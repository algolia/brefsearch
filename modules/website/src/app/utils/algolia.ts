import { algoliasearch } from 'algoliasearch';

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALG_APP_ID!,
  process.env.NEXT_PUBLIC_ALG_API_KEY!,
) as any;
