// Type declarations for modules without bundled types
// Re-export all types from @types/clownface for @lindas/clownface
declare module '@lindas/clownface' {
  export * from 'clownface'
  export { default } from 'clownface'
}
