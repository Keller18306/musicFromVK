import { default as request } from 'request'

async function getLatest(): Promise<string> {
    const { tag_name } = await new Promise((resolve, reject) => {
        request('https://api.github.com/repos/Keller18306/musicFromVK/releases/latest', {
            headers: {
                accept: 'application/vnd.github.v3+json',
                'user-agent': 'Music from VK Bot: https://github.com/Keller18306/musicFromVK'
            }
        }, (err, res, body) => {
            if (err) return reject(new Error(err.toString()))

            if (res.statusCode !== 200) return reject(new Error(`status code ${res.statusCode}`))

            resolve(JSON.parse(body))
        })
    }) as any

    return tag_name
}

function getCurrent() {
    const { version } = require('../package.json')

    return version
}

export async function checkUpdate() {
    const last = await getLatest()

    const current = getCurrent()

    return {
        found: parseInt(current.replace(/\./g, '')) < parseInt(last.replace(/\./g, '')),
        current,
        last
    }
}