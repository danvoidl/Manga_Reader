// Filtros da tela de Explorar: opções de ordenação + rótulos dos grupos de tag.

export interface SortOption {
  key: string
  label: string
  // Campo order[] enviado ao MangaDex (via API GraphQL exploreMangas).
  sort: string
  direction: 'asc' | 'desc'
}

// ⚠️ CONFIRMAR/PREENCHER: os valores de `sort` abaixo são o melhor palpite dos
// campos order[] do MangaDex. Se algum estiver errado, ajuste só aqui — o resto
// da tela (labels, sheet, hook, query) lê a partir desta lista.
// Docs: https://api.mangadex.org/docs/ (GET /manga → parâmetro order[])
export const SORT_OPTIONS: SortOption[] = [
  { key: 'ranking', label: 'Ranking', sort: 'rating', direction: 'desc' },
  // "Best Match": no MangaDex o order[relevance] só funciona junto de um título.
  { key: 'relevance', label: 'Best Match', sort: 'relevance', direction: 'desc' },
  { key: 'year', label: 'Ano de publicação', sort: 'year', direction: 'desc' },
  { key: 'az', label: 'A-Z', sort: 'title', direction: 'asc' },
  { key: 'za', label: 'Z-A', sort: 'title', direction: 'desc' },
  {
    key: 'followers',
    label: 'Quantidade de seguidores',
    sort: 'followedCount',
    direction: 'desc'
  }
]

// Ordenação padrão da tela quando nada foi selecionado.
export const DEFAULT_SORT: SortOption = SORT_OPTIONS[5] // Quantidade de seguidores

// Rótulos e ordem dos grupos de tag do MangaDex (attributes.group). Estas strings
// já são conhecidas e estáveis — não precisam ser preenchidas.
export const TAG_GROUP_LABELS: Record<string, string> = {
  genre: 'Gêneros',
  theme: 'Temas',
  format: 'Formatos',
  content: 'Conteúdo'
}

export const TAG_GROUP_ORDER = ['genre', 'theme', 'format', 'content']
