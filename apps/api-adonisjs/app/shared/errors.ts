const ERR = Symbol('err')

type AppError<C extends string = string> = {
  readonly [ERR]: true
  code: C
  message: string
}

export type Result<T, C extends string = string> = T | AppError<C>

export function ok(): undefined
export function ok<T>(v: T): T
export function ok<T>(v?: T) {
  return v
}
export const err = <C extends string>(code: C, message: string): AppError<C> => ({
  [ERR]: true,
  code,
  message,
})

export const isErr = <T>(r: Result<T>): r is AppError =>
  typeof r === 'object' && r !== null && ERR in r
export const isOk = <T>(r: Result<T>): r is T => !isErr(r)

type Ok<R> = R extends AppError<any> ? never : R
type ErrorCode<R> = Extract<R, AppError<any>>['code']

type Handlers<R> = { [K in ErrorCode<R>]: (e: AppError<K>) => unknown } & {
  ok: (v: Ok<R>) => unknown
}

type Returns<H> = { [K in keyof H]: H[K] extends (...a: any[]) => infer U ? U : never }[keyof H]

export function match<R, H extends Handlers<R>>(res: R, handlers: H): Returns<H> {
  if (isErr(res)) {
    return (handlers as unknown as Record<string, (e: AppError<string>) => unknown>)[res.code](
      res
    ) as Returns<H>
  }
  return handlers.ok(res as Ok<R>) as Returns<H>
}
