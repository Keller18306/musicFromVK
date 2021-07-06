import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getPlaylist'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'start'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'start',
            description: 'Открыть клавиатуру'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Начать'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        ctx.reply('Клавиатура показана', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Моя музыка'
                        }
                    ],
                    [
                        {
                            text: 'Дневной плейлист'
                        },
                        {
                            text: 'Недельный плейлист'
                        }
                    ],
                    [
                        {
                            text: 'Популярное (все жанры)'
                        },
                        {
                            text: 'Популярное (по жанрам)'
                        }
                    ],
                    [
                        {
                            text: 'Новинки'
                        },
                        {
                            text: 'Поиск'
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }
}