/*
<b>bold</b>
<i>italic</i>
<u>underline</u>
<s>strikethrough</s>
*/

import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { readFileSync } from 'fs'

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

    async handler({ tg, ctx }: HandlerParams) {
        const a = await ctx.replyWithAudio({
            source: readFileSync('test.mp3')
        })

        console.log(a)

        return ctx.reply(JSON.stringify(a))
        /*return ctx.reply(
            '<b>bold</b>\n' +
            '<i>italic</i>\n' +
            '<u>underline</u>\n' +
            '<s>strikethrough</s>', {
            parse_mode: 'HTML'
        })*/
    }
}