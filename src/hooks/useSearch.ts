import { useMemo, useState } from 'react';

export function useSearch<T>(items: T[], predicate: (item: T, query: string) => boolean) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => predicate(item, term));
  }, [items, predicate, query]);

  return { query, setQuery, filtered };
}
