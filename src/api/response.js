/**
 * Standard API envelope: { data, message?, meta?, links? }
 */

export function unwrapData(response) {
  const body = response.data

  if (body && typeof body === 'object' && 'data' in body) {
    return body.data
  }

  return body
}

export function unwrapPaginated(response) {
  const body = response.data

  return {
    items: body.data ?? [],
    meta: body.meta ?? null,
    links: body.links ?? null,
    message: body.message ?? null,
  }
}
