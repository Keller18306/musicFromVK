import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'removeKeyboard'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'removeKeyboard',
            description: 'Удаляет клавиатуру'
        }
    ]

    public permission: Permission = 'bot.debug'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        return ctx.reply('removed', {
            reply_markup: {
                remove_keyboard: true
            }
        })
    }
}