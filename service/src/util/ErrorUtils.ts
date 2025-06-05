export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  try {
    return JSON.stringify(error)
  } catch {
    return 'Unknown error'
  }
}