import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { getUserPermissions, Permission } from '../permissions'
import { cmds } from '../bot'

export default class CMD extends BaseCommand {
    public id = 'getCmdPerms'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getCmdPerms',
            description: 'Узнать все команды и разрешения к ним'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        const list: string[] = []

        list.push('id - cmd - permission\n')

        for (const id in cmds) {
            const cmd = cmds[id]
            if (cmd.commands.length == 0) continue;

            list.push(
                `${cmd.id} - /${cmd.commands[0]?.command} - ${cmd.permission}`
            )
        }

        ctx.reply(list.join('\n'))
    }
}