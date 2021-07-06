/*
<b>bold</b>
<i>italic</i>
<u>underline</u>
<s>strikethrough</s>
*/

import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'test'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'test',
            description: 'Тестовая команда'
        }
    ]

    public permission: Permission = 'bot.debug'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        return ctx.reply(
            '<b>bold</b>\n' +
            '<i>italic</i>\n' +
            '<u>underline</u>\n' +
            '<s>strikethrough</s>', {
            parse_mode: 'HTML'
        })
    }
}