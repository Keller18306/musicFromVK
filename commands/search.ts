import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/search'
import { searchId } from '../bot'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'searchMusic'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'search',
            description: 'Поиск музыки в вк'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: true,
            message: 'Поиск'
        },
        {
            caseSensitive: false,
            startsWith: true,
            message: 'Найти'
        },
        {
            caseSensitive: false,
            startsWith: true,
            message: 'Poisk'
        }
    ]

    public permission: Permission = 'bot.search.music'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        const cmd = ctx.message.text.split(' ')[0]

        const text = ctx.message.text.split(' ').slice(1).join(' ')

        if(text == '') return ctx.reply(
            `${cmd} <TEXT>\n`+
            '<TEXT> - текст запроса'
        )

        const id = ctx.message.message_id

        searchId[id] = text

        exec(ctx, text, id)
    }
}