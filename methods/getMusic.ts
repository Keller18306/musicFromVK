import { getAccountMusic } from '../functions'
import { Context } from "telegraf"

export async function exec(ctx: Context, getpage: number = 1) {
    const { keyboard, page, pages } = await getAccountMusic(getpage, 10)

    return ctx.reply(`Page: ${page}/${pages}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    })
}

export async function update(ctx: Context, getpage: number = 1) {
    const { keyboard, page, pages } = await getAccountMusic(getpage, 10)

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

export async function inline(ctx: Context, getpage: number = 1) {
    const { keyboard, page, pages } = await getAccountMusic(getpage, 10)

    //return ctx.answerInlineQuery()
}