import { Context } from "telegraf"
import { getPlaylist } from '../functions'

export async function exec(ctx: Context, id: number, owner_id: number | null = null, getpage: number = 1) {
    const { keyboard, page, pages, title, subtitle } = await getPlaylist(owner_id, id, getpage, 10)

    return ctx.reply(`${title} [${subtitle}]\nPage: ${page}/${pages}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    })
}

export async function update(ctx: Context, id: number, owner_id: number | null = null, getpage: number = 1) {
    const { keyboard, page, pages, title, subtitle } = await getPlaylist(owner_id, id, getpage, 10)

    return ctx.editMessageText(`${title} [${subtitle}]\nPage: ${page}/${pages}`, {
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