import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { compileFunction, createContext, runInNewContext, Script } from 'vm'

type JSCfg = {
    timeout: number
}

export default class CMD extends BaseCommand {
    public id = 'execJs'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'js',
            description: 'Выполнение js кода'
        }
    ]

    public permission: Permission = 'bot.exec.js'

    public messages: Message[] = []

    private jsCFG: JSCfg = {
        timeout: 100
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
            result = await runInNewContext(text, undefined, {
                timeout: this.jsCFG.timeout
            })
        } catch (e) {
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

        //console.log({ error, vmContext })
    }

    info(cmd: string) {
        return `${cmd} <code>\n` +
            '<code> - JS код\n\n' +
            'Дополнительно:\n' +
            `- ограничение по времени выполнения: ${this.jsCFG.timeout}`
    }
}