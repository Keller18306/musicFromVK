import { Context } from "telegraf"
import { searchMusic } from '../functions'

export async function exec(ctx: Context, q: string, id: number, getpage: number = 1) {
    const { keyboard, page } = await searchMusic(q, getpage, 10, id)

    return ctx.reply(`Page: ${page}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    })
}

export async function update(ctx: Context, q: string, id: number, getpage: number = 1) {
    const { keyboard, page } = await searchMusic(q, getpage, 10, id)

    return ctx.editMessageText(`Page: ${page}`, {
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