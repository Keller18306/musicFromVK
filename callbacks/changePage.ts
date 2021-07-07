import { default as BaseCallback, HandlerParams } from './_base'
import { update as getMusic } from '../methods/getMusic'
import { update as getPlaylist } from '../methods/getPlaylist'
import { update as searchMusic } from '../methods/search'
import { update as getRecommendations } from '../methods/getRecommendations'
import { update as getPopular } from '../methods/getPopular'
import { update as getFriends } from '../methods/getFriends'
import { searchId } from '../bot'
import { getUserPermissions, noPerm } from '../permissions'

export default class Callback extends BaseCallback {
    public id: string | null = 'changePage'

    public permission: true = true

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('|')

        const parsed: {
            id: string,
            method: string,
            page: number
        } = {
            id: arg[0],
            method: arg[1],
            page: Number(arg[2])
        }

        return parsed
    }

    handler({ tg, ctx, payload }: HandlerParams) {
        const args = payload.split('|')
        const { method, page } = this.payloadParser(payload)

        if (isNaN(page)) return;
        if (page <= 0) return ctx.answerCbQuery()

        switch (method) {
            case 'getMusic':
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.music'))
                    return noPerm(ctx, 'bot.get.music', 'action')

                return getMusic(ctx, page)

            case 'getPlaylist': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.playlist'))
                    return noPerm(ctx, 'bot.get.playlist', 'action')

                const owner_id = Number(args[3])
                const id = Number(args[4])

                if (isNaN(owner_id)) return;
                if (isNaN(id)) return;

                return getPlaylist(ctx, id, owner_id, page)
            }

            case 'searchMusic': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.search.music'))
                    return noPerm(ctx, 'bot.search.music', 'action')

                const id = Number(args[3])

                if (isNaN(id)) return;

                const q = searchId[id]
                if (q === undefined) return ctx.answerCbQuery('Время жизни этого поиска закончилось', { show_alert: true })

                return searchMusic(ctx, q, id, page)
            }

            case 'getRecommendations':
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.recommendations'))
                    return noPerm(ctx, 'bot.get.recommendations', 'action')

                return getRecommendations(ctx, page)

            case 'getPopular': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.popular'))
                    return noPerm(ctx, 'bot.get.popular', 'action')

                const id = args[3] == null ? undefined : Number(args[3])

                return getPopular(ctx, id, page)
            }
        
            case 'getFriends': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.friends'))
                    return noPerm(ctx, 'bot.get.friends', 'action')

                const id = args[3] == null ? null : Number(args[3])

                return getFriends(ctx, page, id)
            }
        }
    }
}