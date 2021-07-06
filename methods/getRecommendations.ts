import { Context } from "telegraf"
import { getRecommendations } from '../functions'

export async function exec(ctx: Context, getpage: number = 1) {
    const { keyboard, page, pages } = await getRecommendations(getpage, 10)

    return ctx.reply(`Page: ${page}/${pages}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    })
}

export async function update(ctx: Context, getpage: number = 1) {
    const { keyboard, page, pages } = await getRecommendations(getpage, 10)

    return ctx.editMessageText(`Page: ${page}/${pages}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    }).then((r) => {
        ctx.answerCbQuery().catch(() => {})
        return r
    },
    (e) => {
        if(e.response.error_code === 400) return ctx.answerCbQuery().catch(() => {})
        console.error(e)
    })
}