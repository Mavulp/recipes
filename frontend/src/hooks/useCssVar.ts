export function useCssVar(varName: string): string {
  const root = document.querySelector(':root')
  return getComputedStyle(root!).getPropertyValue(varName)
}
