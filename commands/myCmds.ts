import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { getUserPermissions, Permission } from '../permissions'
import { cmds } from '../bot'

export default class CMD extends BaseCommand {
    public id = 'getMyCmds'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'help',
            description: 'Узнать доступные вам команды'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'getMyCmds',
            description: 'Узнать доступные вам команды'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'myCmds',
            description: 'Узнать доступные вам команды'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        const list: string[] = []

        const { permissions: myPerms } = getUserPermissions(ctx.message.from.id)

        for (const id in cmds) {
            const cmd = cmds[id]
            if (cmd.commands.length == 0) continue;
            if(cmd.permission === null || (cmd.permission !== true && !myPerms.includes(cmd.permission))) continue;

            list.push(
                `/${cmd.commands[0].command} - ${cmd.commands[0].description}`
            )
        }

        ctx.reply(`Доступные вам комманды:\n${list.join('\n')}`)
    }
}