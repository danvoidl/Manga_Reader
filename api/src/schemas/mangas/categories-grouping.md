# Referência: agrupar categorias pelo `group` no lado da API

> **Status: apenas referência — NÃO está wired.** Hoje o agrupamento das tags
> (Formatos, Gêneros, Temas, Conteúdo) é feito no client (`reader-app`), a partir
> da query `categories`, usando o campo `attributes.group` de cada tag. Este
> documento mostra como seria fazer o **mesmo agrupamento no servidor**, caso um
> dia se prefira mandar as tags já agrupadas para o app.

## Contexto

O MangaDex expõe as tags em `GET /manga/tag`. Cada tag tem um
`attributes.group` que assume um destes valores:

| `group`   | Rótulo (pt-BR) |
| --------- | -------------- |
| `genre`   | Gêneros        |
| `theme`   | Temas          |
| `format`  | Formatos       |
| `content` | Conteúdo       |

A query atual `categories: [Tag!]!` ([resolvers.ts](resolvers.ts)) devolve a lista
plana. O client é quem separa por `group`. Abaixo, a alternativa server-side.

## 1. Novo type + query no schema

Em [schema.ts](schema.ts), aproveitando o `Tag`/`TagAttributes` já existentes:

```graphql
type TagGroup {
  "Valor cru do MangaDex: genre | theme | format | content"
  group: String!
  tags: [Tag!]!
}

type Query {
  # ...queries existentes...
  "Categorias já agrupadas pelo group da tag (genre/theme/format/content)"
  categoriesByGroup: [TagGroup!]!
}
```

## 2. Resolver

Reusa o `getTags()` do module ([../../repository/modules/manga.module.ts](../../repository/modules/manga.module.ts))
— nenhuma chamada nova ao MangaDex — e agrupa em memória. Mesmo padrão
Go-style `[error, resp]` → `[]` dos outros resolvers:

```ts
// Ordem em que os grupos são devolvidos (o resto vai para o fim).
const GROUP_ORDER = ['genre', 'theme', 'format', 'content']

categoriesByGroup: async () => {
  const [error, resp] = await modules.manga.getTags()

  if (error) return []

  // Agrupa as tags por attributes.group.
  const byGroup = resp.data.reduce<Record<string, Tag[]>>((acc, tag) => {
    const group = tag.attributes?.group ?? 'other'
    ;(acc[group] ??= []).push(tag)
    return acc
  }, {})

  // Converte para [{ group, tags }] respeitando GROUP_ORDER.
  return Object.entries(byGroup)
    .map(([group, tags]) => ({ group, tags }))
    .sort(
      (a, b) =>
        (GROUP_ORDER.indexOf(a.group) + 1 || Infinity) -
        (GROUP_ORDER.indexOf(b.group) + 1 || Infinity)
    )
}
```

(`Tag` já é exportado de [../../types/manga.ts](../../types/manga.ts).)

## 3. Como o client consumiria

```graphql
query CategoriesByGroup {
  categoriesByGroup {
    group
    tags {
      id
      attributes {
        name { en pt_br }
      }
    }
  }
}
```

O app iteraria direto sobre `categoriesByGroup`, mapeando `group` → rótulo pt-BR,
sem precisar agrupar nada.

## Server-side vs. client-side — trade-offs

| | Client-side (atual) | Server-side (`categoriesByGroup`) |
| --- | --- | --- |
| Chamadas ao MangaDex | 1 (`/manga/tag`) | 1 (`/manga/tag`) |
| Onde agrupa | No app (`reduce` por `group`) | Na API |
| Schema | Só `categories` | + `TagGroup` + query nova |
| Payload | Lista plana | Já estruturado |
| Flexibilidade no app | Alta (reagrupa/filtra à vontade) | Menor (vem pronto) |

Para este projeto, o agrupamento é barato e o app já precisa da lista de tags
para outras coisas, então **fazer no client é suficiente**. A versão server-side
vale a pena se mais de um cliente precisar do mesmo agrupamento ou se quiser
enxugar a lógica do app.
