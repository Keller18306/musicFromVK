import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { buildGenresKeyboard } from '../functions/'

export default class CMD extends BaseCommand {
    public id = 'genresPopular'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'genresPopular',
            description: 'Получает жанры популярной музыки'
        }
    ]

    public permission: Permission = 'bot.get.popular'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        return ctx.reply('Жанры популярной музыки:', {
            reply_markup: {
                inline_keyboard: buildGenresKeyboard(2)
            }
        })
    }
}