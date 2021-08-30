import { Composer, Telegraf } from 'telegraf'
import { BotCommand, CallbackQuery, InlineQueryResultArticle } from 'typegram';
import { getCommands, getCallbacks, getInlines } from './loader';
import BaseCommand from './commands/_base';
import BaseCallback from './callbacks/_base';
import BaseInline from './inline/_base';
import { getUserPermissions, noPerm } from './permissions';
import { config } from './config';

export const tg = new Telegraf(config.tg_token)
/*
tg.command(['id', 'myid'], (ctx) => {
    ctx.reply(`${ctx.from.id}`)
})
*/
/*tg.use((ctx, next) => {
    if (ctx.from?.id == undefined) return;
    if (![804594266, 1078771932, 1305235628].includes(ctx.from?.id)) {
        if (ctx.updateType !== 'message') return;
        return ctx.reply('403: access denied');
    }

    next()
})*/

export const searchId: {
    [index: number]: string
} = {}

export const callbacks: {
    [id: string]: BaseCallback
} = getCallbacks()

tg.on('callback_query', async (ctx) => {
    if (ctx.updateType != 'callback_query') return;

    if (ctx.callbackQuery.message == undefined) return;

    const data: (CallbackQuery & { data?: string }) = ctx.callbackQuery
    if (data.data === undefined) return;

    const id = data.data.split('|')[0]
    if (id === undefined) return;

    const cb = callbacks[id]
    if (cb === undefined) return;

    if (cb.permission === null) return ctx.reply('Для данной команды ещё не настроены права')

    const uPerms = getUserPermissions(data.from.id)

    if (cb.permission !== true && !uPerms.permissions.includes(cb.permission))
        return noPerm(ctx, cb.permission, 'action');

    console.log(data.data);

    (async () => {
        const setList: {
            setTimeouts: NodeJS.Timeout[],
            setIntervals: NodeJS.Timeout[]
        } = {
            setTimeouts: [],
            setIntervals: []
        }

        try {
            await cb.handler({ tg, ctx, setList, payload: data.data! })
        } catch (e) {
            console.error(id, e)
            ctx.reply(`Произошла ошибка во время выполнения Callback #${id}: ${e.toString()}`)
        }

        for(const timeout of setList.setTimeouts) clearTimeout(timeout)
        for(const interval of setList.setIntervals) clearInterval(interval)
    })();

    return;
})

export const cmds: {
    [id: string]: BaseCommand
} = getCommands()

tg.on('text', async (ctx) => {
    let message: string = ctx.message.text

    const isCommand: boolean = message.startsWith('/')

    for (const id in cmds) {
        const cmd = cmds[id]

        if (isCommand) {
            for (const icmd of cmd.commands) {
                let command: string = message.substr(1)
                let sysCommand: string = icmd.command

                if (!icmd.caseSensitive) {
                    command = command.toLowerCase()
                    sysCommand = sysCommand.toLowerCase()
                }

                if (icmd.startsWith) {
                    command = command.split(' ')[0]
                }

                if (command != sysCommand) continue;

                if (cmd.permission === null) return ctx.reply('Для данной команды ещё не настроены права')

                const uPerms = getUserPermissions(ctx.message.from.id)

                if (cmd.permission !== true && !uPerms.permissions.includes(cmd.permission)) return ctx.reply(
                    `Ваш аккаунт или ваша группа "${uPerms.group}" не имеет разрешения "${cmd.permission}".`
                );

                console.log(command);

                (async () => {
                    const setList: {
                        setTimeouts: NodeJS.Timeout[],
                        setIntervals: NodeJS.Timeout[]
                    } = {
                        setTimeouts: [],
                        setIntervals: []
                    }

                    try {
                        await cmd.handler({ tg, ctx, setList })
                    } catch (e) {
                        console.error(id, e)
                        ctx.reply(`Произошла ошибка во время выполнения Command #${id}: ${e.toString()}`)
                    }

                    for(const timeout of setList.setTimeouts) clearTimeout(timeout)
                    for(const interval of setList.setIntervals) clearInterval(interval)
                })()

                return;
            }
        } else {
            for (const icmd of cmd.messages) {
                let command: string = message
                let sysCommand: string = icmd.message

                if (!icmd.caseSensitive) {
                    command = command.toLowerCase()
                    sysCommand = sysCommand.toLowerCase()
                }

                if (icmd.startsWith) {
                    command = command.split(' ')[0]
                }

                if (command != sysCommand) continue;

                if (cmd.permission === null) return ctx.reply('Для данной команды ещё не настроены права')

                const uPerms = getUserPermissions(ctx.message.from.id)

                if (cmd.permission !== true && !uPerms.permissions.includes(cmd.permission)) return ctx.reply(
                    `Ваш аккаунт или ваша группа "${uPerms.group}" не имеет разрешения "${cmd.permission}".`
                );

                console.log(command);

                (async () => {
                    const setList: {
                        setTimeouts: NodeJS.Timeout[],
                        setIntervals: NodeJS.Timeout[]
                    } = {
                        setTimeouts: [],
                        setIntervals: []
                    }

                    try {
                        await cmd.handler({ tg, ctx, setList })
                    } catch (e) {
                        console.error(id, e)
                        ctx.reply(`Произошла ошибка во время выполнения Command #${id}: ${e.toString()}`)
                    }

                    for(const timeout of setList.setTimeouts) clearTimeout(timeout)
                    for(const interval of setList.setIntervals) clearInterval(interval)
                })()

                return;
            }
        }
    }
    //console.log(cmds)
})
/*
const inlines: {
    [id: string]: BaseInline
} = getInlines()

tg.on('inline_query', async (ctx) => {
    const message = ctx.inlineQuery.query

    if (message === '') {
        const results: InlineQueryResultArticle[] = []

        for (const id in inlines) {
            const inline = inlines[id]
            for (const article of inline.articles) {
                if (!article.registerTG) continue;
                results.push({
                    type: 'article',
                    id: `${id}|${article.text}`,
                    title: `${article.text} - ${article.description}`,
                    input_message_content: {
                        message_text: 'Метод не введён'
                    }
                })
            }
        }

        return ctx.answerInlineQuery(results)
    }

    for (const id in inlines) {
        const inline = inlines[id]
        for (const article of inline.articles) {
            let sysMethod: string = article.text
            let uMethod: string = message

            if (!article.caseSensitive) {
                sysMethod = sysMethod.toLowerCase()
                uMethod = uMethod.toLowerCase()
            }

            if (article.startsWith) {
                uMethod = uMethod.split(' ')[0]
            }

            if (sysMethod != uMethod) continue;

            await inline.handler({ tg, ctx })

            return;
        }
    }
})*/

async function init(): Promise<void> {
    console.log('Starting bot...')

    console.log('Setting commands...')
    const commands: BotCommand[] = []

    for (const id in cmds) {
        const cmd = cmds[id]
        for (const icmd of cmd.commands) {
            if (!icmd.registerTG) continue;

            commands.push({
                command: icmd.command.toLowerCase(),
                description: icmd.description
            })
        }
    }

    await tg.telegram.setMyCommands(commands)

    console.log('Start listen updates...')
    await tg.launch().then(async () => {
        console.log('Bot started')
    }, (err) => {
        console.log('error:', err)
    })
}

init()