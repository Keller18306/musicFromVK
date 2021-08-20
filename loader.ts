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

        if(Object.keys(cmds).includes(cmd.id)) throw new Error(`cmd id '${cmd.id}' is already registred`)

        cmds[cmd.id] = cmd
    }

    console.log(`Loaded ${Object.keys(cmds).length} commands`)

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

        if(Object.keys(callbacks).includes(cb.id)) throw new Error(`callback id '${cb.id}' is already registred`)

        callbacks[cb.id] = cb
    }

    console.log(`Loaded ${Object.keys(callbacks).length} callbacks`)

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

        if(Object.keys(inlines).includes(inline.id)) throw new Error(`inline id '${inline.id}' is already registred`)

        inlines[inline.id] = inline
    }

    console.log(`Loaded ${Object.keys(inlines).length} inlines`)

    return inlines
}