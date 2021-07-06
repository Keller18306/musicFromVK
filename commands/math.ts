import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { compileFunction, createContext, runInNewContext, Script } from 'vm'
import { createGzip } from 'zlib'

type JSCfg = {
    timeout: number
}

export default class CMD extends BaseCommand {
    public id = 'math'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'math',
            description: 'Посчитать пример'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: true,
            message: '!math'
        }
    ]

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const cmd = ctx.message.text.split(' ')[0]

        let text = ctx.message.text.split(' ').slice(1).join(' ')
        if (text === '') return ctx.reply(this.info(cmd))

        let error: string | null = null
        let result: any;

        text = text.replace(/ /g, '')

        const allowStrings: string = '0123456789+-*/():^×÷ekк'
        let allowed: boolean = true
        for (const char of text) {
            if (allowStrings.includes(char)) continue;
            allowed = false
            break;
        }

        if (!allowed) return ctx.reply(
            'В примере имеются лишние символы.\n' +
            `Список разрешённых: ${allowStrings}`
        )

        const replace: { [key: string]: string } = {
            '\\^': '**',
            '×': '*',
            '÷': '/',
            ':': '/',
            'k': '000',
            'к': '000'
        }

        for (const from in replace) {
            const to = replace[from]
            text = text.replace(new RegExp(from, 'gi'), to)
        }

        let correct: boolean = true

        if (text.split('(').length != text.split(')').length) correct = false
        if (correct && !'(0123456789'.includes(text[0])) correct = false
        if (correct && !')0123456789'.includes(text[text.length - 1])) correct = false
        if (
            correct &&
            text.split('(').length > 1 &&
            !text.includes('/') &&
            !text.includes('*') &&
            !text.includes('+') &&
            !text.includes('-')
        ) correct = false

        if (!correct) return ctx.reply(
            'Пример записан неправильно'
        )

        try {
            result = await runInNewContext(text, undefined, {
                timeout: 100
            })
        } catch (e) {
            error = e.toString()
        }

        console.log(text, result, error)

        if (error) return ctx.reply(
            'Произошла ошибка во время выполнения:\n' +
            `${error}`
        )

        if (result === Infinity) return ctx.reply(
            'бесконечность'
        )

        if (typeof result !== 'number') return ctx.reply(
            'Выходящий тип данных почему-то не равен number'
        )

        ctx.reply(`${result}`.substr(0, 4096))
    }

    info(cmd: string) {
        return `${cmd} <some>\n` +
            '<some> - математический пример'
    }
}