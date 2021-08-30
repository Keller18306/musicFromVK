import { Context, Telegraf, NarrowedContext } from "telegraf"
import * as tg from 'telegraf/typings/core/types/typegram'
import * as tt from 'telegraf/typings/telegram-types'
import { Permission } from "../permissions"

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
    ctx: MatchedContext<Context, 'callback_query'>,
    setList: {
        setTimeouts: NodeJS.Timeout[],
        setIntervals: NodeJS.Timeout[]
    },
    payload: string
}

export default abstract class BaseCallback {
    public id: string | null = null

    public permission: Permission | null | true = null

    constructor() {}

    abstract payloadParser(payload: string): object

    abstract handler(params: HandlerParams): any
}