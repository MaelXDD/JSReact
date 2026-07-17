export function isSupabaseError(err: unknown): err is { message: string } {
    return typeof err === 'object' && err !== null && 'message' in err
}