import { Context, Telegraf, NarrowedContext } from 'telegraf'
import * as tg from 'telegraf/typings/core/types/typegram'
import * as tt from 'telegraf/typings/telegram-types'
import { Permission } from '../permissions'

export type Command = {
    caseSensitive: boolean
    startsWith: boolean
    registerTG: boolean
    command: string
    description: string
}

export type Message = {
    caseSensitive: boolean
    startsWith: boolean
    message: string
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
    ctx: MatchedContext<Context, 'text'>,
    setList: {
        setTimeouts: NodeJS.Timeout[],
        setIntervals: NodeJS.Timeout[]
    }
}

export default abstract class BaseCommand {
    public id: string | null = null

    public commands: Command[] = []

    public messages: Message[] = []

    public permission: Permission | null | true = null

    constructor() { }

    abstract handler(params: HandlerParams): any
}