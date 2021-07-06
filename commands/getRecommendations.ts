import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getRecommendations'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getRecommendations'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getRecommendations',
            description: 'Получает рекомендации с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'recommendations',
            description: 'Получает рекомендации с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'recom',
            description: 'Получает рекомендации с аккаунта'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Мои рекомендации'
        },
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Рекомендации'
        }
    ]

    public permission: Permission = 'bot.get.recommendations'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx, 1)
    }
}