import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { compileFunction, createContext, runInNewContext, runInThisContext, Script } from 'vm'
import { vk } from '../vk'
import * as fs from 'fs'
import * as crypto from 'crypto'
import { cmds, callbacks } from '../bot'

type JSCfg = {
    timeout: number
}

export default class CMD extends BaseCommand {
    public id = 'eval'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'eval',
            description: 'Выполнение js кода в боте'
        }
    ]

    public permission: Permission = 'bot.eval'

    public messages: Message[] = []

    private jsCFG: JSCfg = {
        timeout: 10000
    }

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const cmd = ctx.message.text.split(' ')[0]

        const text = ctx.message.text.split(' ').slice(1).join(' ')
        if (text === '') return ctx.reply(this.info(cmd))

        let error: string | null = null
        let execTime: number;
        let result: any;

        execTime = new Date().getTime()
        try {
            result = await runInNewContext(text, {
                global, clearInterval, clearTimeout, setInterval,
                setTimeout, queueMicrotask, clearImmediate, setImmediate,
                tg, ctx, vk, fs, crypto, require, process, Buffer,
                cmds, callbacks
            }, {
                timeout: this.jsCFG.timeout
            })
        } catch (e: any) {
            error = e.toString()
        }
        execTime = new Date().getTime() - execTime

        if (error) return ctx.reply(
            'Произошла ошибка во время выполнения:\n' +
            `${error}\n\n` +
            `Время выполнения: ${execTime}мс.`
        )

        try {
            if (typeof result === 'object') result = JSON.stringify(result, null, 4)
        } catch (e) { }

        if (result !== undefined) ctx.reply(`${result}`.substr(0, 4096))

        ctx.reply(
            'Выполнено без ошибок\n' +
            `Время выполнения: ${execTime}мс.`
        )
    }

    info(cmd: string) {
        return `${cmd} <code>\n` +
            '<code> - JS код\n\n' +
            'Дополнительно:\n' +
            `- ограничение по времени выполнения: ${this.jsCFG.timeout}`
    }
}