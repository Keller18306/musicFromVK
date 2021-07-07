import { Context } from "telegraf"
import { getFriends } from '../functions/getFriends'

export async function exec(ctx: Context, getpage: number = 1, owner_id: number | null = null) {
    const { keyboard, page, pages } = await getFriends(owner_id, getpage, 10)

    return ctx.reply(`Page: ${page}/${pages}`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    })
}

export async function update(ctx: Context, getpage: number = 1, owner_id: number | null = null) {
    const { keyboard, page, pages } = await getFriends(owner_id, getpage, 10)

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


    //return ctx.answerInlineQuery()
}