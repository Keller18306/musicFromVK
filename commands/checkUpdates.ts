import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { default as request } from 'request'

export default class CMD extends BaseCommand {
    public id = 'checkUpdate'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'checkUpdate',
            description: 'Проверяет наличие новой версии бота'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'checkUpdates',
            description: 'Проверяет наличие новой версии бота'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const { error, err, body } = await new Promise(resolve => {
            request('https://raw.githubusercontent.com/Keller18306/musicFromVK/main/package.json', {}, (err, res, body) => {
                if (err) return resolve({ error: true, err: err.toString() })

                if (res.statusCode !== 200) return resolve({ error: true, err: `status code ${res.statusCode}` })

                resolve({ error: false, body: JSON.parse(body) })
            })
        }) as { error: boolean, err?: string, body?: { version: string, [key: string]: any } }

        if (error) return ctx.reply(`http request error\n${err}`)

        const { version: currentVersion } = require('../package.json')

        const githubVersion: string = body!.version

        ctx.reply(
            (currentVersion === githubVersion ?
                'Обновлений не найдено' : 'Доступна новая версия!') +
            '\n\n' +
            `Текущая версия: ${currentVersion}\n` +
            `Новая версия: ${githubVersion}`
        )
    }
}