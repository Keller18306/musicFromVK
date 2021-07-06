import { Context } from "telegraf"
import { getPopular } from '../functions'
import { genres } from "../vk"

export async function exec(ctx: Context, id: number | undefined | null = null, getpage: number = 1) {
    const { keyboard, page, pages } = await getPopular(id, getpage, 10)

    return ctx.reply(`${id == null ? 'Все жанры' : `Жанр: ${genres[id]}`}\nPage: ${page}/${pages}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    })
}

export async function update(ctx: Context, id: number | undefined | null = null, getpage: number = 1) {
    const { keyboard, page, pages } = await getPopular(id, getpage, 10)

    return ctx.editMessageText(`${id == null ? 'Все жанры' : `Жанр: ${genres[id]}`}\nPage: ${page}/${pages}`, {
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