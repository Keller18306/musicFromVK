import { Article, HandlerParams, default as BaseInline } from './_base'

export default class Inline extends BaseInline {
    public id: string | null = 'getMusic'

    public articles: Article[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            text: 'getMusic',
            description: 'пока пусто'
        }
    ]

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        console.log(ctx.inlineQuery)
    }
}