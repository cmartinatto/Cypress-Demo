// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBody<T = Record<string, any>>(response: Cypress.Response<unknown>): T {
  return (
    typeof response.body === "string" ? JSON.parse(response.body) : response.body
  ) as T;
}
