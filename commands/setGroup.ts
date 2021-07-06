import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { groups, Permission, setUserGroup } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'setGroup'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'setGroup',
            description: 'Установить группу человеку'
        }
    ]

    public permission: Permission = 'bot.set.group'

    public messages: Message[] = []

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const cmd = ctx.message.text.split(' ')[0]
        let id: number | string = ctx.message.text.split(' ')[1]
        const group = ctx.message.text.split(' ')[2]

        if(id === undefined || id === '' || group === undefined || group === '') return ctx.reply(this.info(cmd))
        id = Number(id)

        if(isNaN(id)) return ctx.reply('<id> must be `number`')

        if(!Object.keys(groups).includes(group)) return ctx.reply(`<group> must include [${Object.keys(groups).join(',')}]`)

        setUserGroup(id, group)

        ctx.reply('ok')
    }

    info(cmd: string) {
        return `${cmd} <id> <group>\n` +
            '<id> - id человека в Telegram\n'+
            '<group> - группа для человека\n\n'+
            'Доступные группы:\n'+
            `${Object.keys(groups).join(', ')}`
    }
}