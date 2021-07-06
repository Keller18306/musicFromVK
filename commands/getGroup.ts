import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { getGroupPermissions, groups, Permission, setUserGroup } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getGroup'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'getGroup',
            description: 'Узнать разрешения группы'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const cmd = ctx.message.text.split(' ')[0]
        const group = ctx.message.text.split(' ')[1]

        if(group === undefined || group === '') return ctx.reply(this.info(cmd))

        if(!Object.keys(groups).includes(group)) return ctx.reply(`<group> must include [${Object.keys(groups).join(',')}]`)

        ctx.reply(getGroupPermissions(group).join(', '))
    }

    info(cmd: string) {
        return `${cmd} <group>\n` +
            '<group> - группа\n\n'+
            'Доступные группы:\n'+
            `${Object.keys(groups).join(', ')}`
    }
}