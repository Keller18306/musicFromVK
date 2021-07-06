import { Context, Telegraf, NarrowedContext } from 'telegraf'
import * as tg from 'telegraf/typings/core/types/typegram'
import * as tt from 'telegraf/typings/telegram-types'

export type Article = {
    caseSensitive: boolean
    startsWith: boolean
    registerTG: boolean
    text: string
    description: string
}

type MountMap = {
    [T in tt.UpdateType]: Extract<tg.Update, Record<T, object>>
} & {
        [T in tt.MessageSubType]: {
            message: Extract<tg.Update.MessageUpdate['message'], Record<T, unknown>>
            update_id: number
        }
    }

type MatchedContext<
    C extends Context,
    T extends tt.UpdateType | tt.MessageSubType
    > = NarrowedContext<C, MountMap[T]>

export type HandlerParams = {
    tg: Telegraf,
    ctx: MatchedContext<Context, 'inline_query'>
}

export default abstract class BaseInline {
    public id: string | null = null

    public articles: Article[] = []

    constructor() { }

    abstract handler(params: HandlerParams): any
}