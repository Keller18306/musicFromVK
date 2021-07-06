import { randomBytes } from "crypto"
import { existsSync, writeFileSync } from "fs"
import { Context } from "telegraf"

export const Permissions: Permission[] = ['bot.get.music', 'bot.get.audio', 'bot.add.admin', 'bot.base.commands',
    'bot.eval', 'bot.debug', 'bot.search.music', 'bot.get.playlist',
    'bot.get.recommendations', 'bot.exec.js', 'bot.add.to.music', 'bot.send.start.event',
    'bot.delete.music', 'bot.get.page', 'bot.set.group', 'bot.get.popular'
]

export type Permission = 'bot.get.music' | 'bot.get.audio' | 'bot.add.admin' | 'bot.base.commands' |
    'bot.eval' | 'bot.debug' | 'bot.search.music' | 'bot.get.playlist' |
    'bot.get.recommendations' | 'bot.exec.js' | 'bot.add.to.music' | 'bot.send.start.event' |
    'bot.delete.music' | 'bot.get.page' | 'bot.set.group' | 'bot.get.popular'

export type JSONUsers = {
    [id: string]: {
        group: string,
        permissions: Permission[]
    }
}

export const groups: {
    [group: string]: {
        childGroup: string | null
        permissions: Permission[]
    }
} = {
    guest: {
        childGroup: null,
        permissions: [
            'bot.base.commands'
        ]
    },
    member: {
        childGroup: 'guest',
        permissions: [
            'bot.get.music', 'bot.get.playlist',
            'bot.search.music', 'bot.get.recommendations',
            'bot.get.audio', 'bot.get.popular'
        ]
    },
    owner: {
        childGroup: 'member',
        permissions: [
            'bot.add.to.music', 'bot.send.start.event',
            'bot.delete.music', 'bot.get.page'
        ]
    },
    admin: {
        childGroup: 'owner',
        permissions: [
            'bot.eval', 'bot.debug', 'bot.add.admin', 'bot.exec.js',
            'bot.set.group'
        ]
    }
}

const json: JSONUsers = existsSync('./users.json') ? require('./users.json') : {}

function saveUsers() {
    writeFileSync('./users.json', JSON.stringify(json, null, 4))
}

if(!existsSync('./users.json')) saveUsers()

export let setupKey: string | null = null;
if(Object.keys(json).length == 0) {
    setupKey = randomBytes(24).toString('hex')
    console.log(`[SETUP] Для получения прав администратора напишите боту: /setup ${setupKey}`)
}

export function getGroupPermissions(groupid: string, _current: Permission[] = []): Permission[] {
    const group = groups[groupid]

    _current.push(...group.permissions)

    if (group.childGroup === null) return _current;

    return getGroupPermissions(group.childGroup, _current)
}

export function getUserPermissions(id: number): { group: string, permissions: Permission[] } {
    const permissions: Permission[] = []

    const user = json[id] || {
        group: 'guest',
        permissions: []
    }

    const groupPerm = getGroupPermissions(user.group)

    permissions.push(...user.permissions)
    permissions.push(...groupPerm)

    return { group: user.group, permissions }
}

export function noPerm(ctx: Context, needPerm: Permission, type: 'message' | 'action') {
    let id: number | null = null;

    if (type === 'message') id = ctx.from!.id
    if (type === 'action') id = ctx.callbackQuery!.from.id
    if (id === null) throw new Error('error getting id')

    const u = getUserPermissions(id)

    if (type === 'message') return ctx.reply(
        `Ваш аккаунт или ваша группа "${u.group}" не имеет разрешения "${needPerm}".`
    )

    if (type === 'action') return ctx.answerCbQuery(
        `Ваш аккаунт или ваша группа "${u.group}" не имеет разрешения "${needPerm}".`,
        { show_alert: true }
    )

    throw new Error('unknown type')
}

export function setUserGroup(id: number, group: string) {
    if (json[id] === undefined) json[id] = {
        group: 'guest',
        permissions: []
    }

    json[id].group = group
    saveUsers()
}