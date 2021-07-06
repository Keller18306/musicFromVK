import { readdirSync } from 'fs'
import BaseCallback from './callbacks/_base'
import BaseCommand from './commands/_base'
import BaseInline from './inline/_base'

export function getCommands() {
    const cmds: {
        [id: string]: BaseCommand
    } = {}

    const dir = readdirSync('./commands/')

    for (const file of dir) {
        const { default: cmdClass } = require(`./commands/${file}`)

        const cmd: BaseCommand = new cmdClass()

        if(cmd.id == null) continue;

        cmds[cmd.id] = cmd
    }

    return cmds
}

export function getCallbacks() {
    const callbacks: {
        [id: string]: BaseCallback
    } = {}

    const dir = readdirSync('./callbacks/')

    for (const file of dir) {
        const { default: cbClass } = require(`./callbacks/${file}`)

        const cb: BaseCallback = new cbClass()

        if(cb.id == null) continue;

        callbacks[cb.id] = cb
    }

    return callbacks
}

export function getInlines() {
    const inlines: {
        [id: string]: BaseInline
    } = {}

    const dir = readdirSync('./inline/')

    for (const file of dir) {
        const { default: inlineClass } = require(`./inline/${file}`)

        const inline: BaseInline = new inlineClass()

        if(inline.id == null) continue;

        inlines[inline.id] = inline
    }

    return inlines
}