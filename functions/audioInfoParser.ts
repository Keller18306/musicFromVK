import { readFileSync } from 'fs'
import { BitsStream, Stream } from '../utils'

const audioVersions: (number | string)[] = [
    2.5,
    'reserved',
    2,
    1
]

const layers: (string | number)[] = [
    'reserved',
    3,
    2,
    1
]

const kbpsTable: (string | number)[][] = [
    [
        'free', 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 'bad'
    ],
    [
        'free', 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 'bad'
    ],
    [
        'free', 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 'bad'
    ],
    [
        'free', 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 'bad'
    ],
    [
        'free', 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 'bad'
    ]
]

const freqTable: (string | number)[][] = [
    [
        44100, 48000, 32000, 'reserv'
    ],
    [
        22050, 24000, 16000, 'reserv'
    ],
    [
        11025, 12000, 8000, 'reserv'
    ]
]

const modeTable: string[] = [
    'Stereo',
    'Joint Stereo',
    'Dual Stereo',
    'Single Stereo'
]

const samplesTable: number[][] = [
    [
        384, 1152, 1152
    ],
    [
        384, 1152, 576
    ],
    [
        384, 1152, 576
    ]
]

function BitrateColumn(v: string | number, l: string | number): number {
    if (typeof v === 'string' || typeof l === 'string') return -1

    if (v === 1 && l === 1) return 0
    if (v === 1 && l === 2) return 1
    if (v === 1 && l === 3) return 2
    if (v === 2 && l === 1) return 3
    if (v === 2 && (l === 2 || l === 3)) return 4

    return -1
}

function FreqColumn(v: number | string): number {
    if (typeof v === 'string') return -1

    if (v === 1) return 0
    if (v === 2) return 1
    if (v === 2.5) return 2

    return -1
}

function getSample(v: string | number, l: string | number): number {
    if (typeof v === 'string' || typeof l === 'string') return -1

    let vIndex: number = -1;
    if (v === 1) vIndex = 0;
    if (v === 2) vIndex = 1;
    if (v === 2.5) vIndex = 2;

    if (vIndex === -1) return -1;

    return samplesTable[vIndex][l - 1];
}

function AudioFrameLength(v: number | string, l: number | string, bitrate: number | string, frequency: number | string, padding: boolean): number {
    if (typeof v === 'string' || typeof l === 'string' || typeof bitrate === 'string' || typeof frequency === 'string') return -1;

    bitrate *= 1000

    const samplesPerSecond = getSample(v, l)
    if (samplesPerSecond === -1) return -1;

    return Math.floor(((samplesPerSecond / 8 * bitrate) / frequency) + Number(padding))
}

function ID3Parser(stream: Stream) {
    const tag = stream.readString(3)

    const ver1 = stream.readUInt(1)
    const ver2 = stream.readUInt(1)

    const flags = stream.readBites(1).padStart(8, '0')

    const parsedFlags = {
        unsynchronisation: Boolean(flags[0]),
        extHeader: Boolean(flags[1]),
        experimental: Boolean(flags[2]),
        footer: Boolean(flags[0])
    }

    const partsTags: string[] = []
    for (let i = 0; i < 4; i++) {
        const bits = stream.readBites(1).padStart(8, '0')
        partsTags.push(bits.substr(1))
    }

    const lengthTags = parseInt(partsTags.join(''), 2)

    return {
        tag,
        ver: `2.${ver1}.${ver2}`,
        flags: parsedFlags,
        lengthTags
    }
}

function ParseAudioFrameHeader(stream: Stream) {
    const bstream = new BitsStream(stream.readBites(4).padStart(4 * 8, '0'))

    const bits = {
        frameSync: bstream.read(11),
        audioVersion: bstream.readInt(2),
        layer: bstream.readInt(2),
        protection: !bstream.readBool(),
        bitrate: bstream.readInt(4),
        frequency: bstream.readInt(2),
        padding: bstream.readBool(),
        private: bstream.readBool(),
        channelMode: bstream.readInt(2),
        modeExtension: bstream.readInt(2),
        copyright: bstream.readBool(),
        original: bstream.readBool(),
        emphasis: bstream.readInt(2)
    }

    const audioVersion = audioVersions[bits.audioVersion]
    const layer = layers[bits.layer]

    const bitrateColumn = BitrateColumn(audioVersion, layer)
    let bitrate: string | number = 'err';
    if (bitrateColumn !== -1) bitrate = kbpsTable[bitrateColumn][bits.bitrate]

    const freqColumn = FreqColumn(audioVersion)
    let frequency: string | number = 'err';
    if (freqColumn !== -1) frequency = freqTable[freqColumn][bits.frequency]

    const mode = modeTable[bits.channelMode]

    return {
        frameSync: bits.frameSync,
        audioVersion,
        layer,
        bitrate,
        frequency,
        mode,
        padding: bits.padding
    }
}

function isLocked(arr: any[]): boolean {
    const obj: { [key: string]: any } = {}

    for (const i of arr) {
        if (obj[i] === undefined) obj[i] = 0
        obj[i]++
    }

    return Object.keys(obj).length === 1
}

function getMust(arr: any[]): string {
    const obj: { [key: string]: any } = {}

    for (const i of arr) {
        if (obj[i] === undefined) obj[i] = 0
        obj[i]++
    }

    let max: number = 0;
    for (const i in obj) {
        const v = obj[i]
        if (v > max) max = v
    }

    let res: string = ''
    for (const i in obj) {
        const v = obj[i]
        if (v !== max) continue;

        res = i

        break;
    }

    return res
}

function getOverage(arr: (string | number)[]): number {
    let sum: number = 0;

    for (const i of arr) {
        if (typeof i === 'string') continue;
        sum += i
    }

    return sum / arr.length
}

export function audioInfoParser(buffer: Buffer): { kbps: number, khz: number, mode: string } {
    const stream = new Stream(buffer)

    const ID3Header = ID3Parser(stream)
    //console.log(ID3Header)

    const ID3Tags = stream.read(ID3Header.lengthTags)
    //console.log(ID3Tags.toString())

    const bitrates: any[] = []
    const frequences: any[] = []
    const modes: any[] = []

    while (true) {
        if (stream.getLastLength() === 0) break;

        const a = ParseAudioFrameHeader(stream)
        const l = AudioFrameLength(a.audioVersion, a.layer, a.bitrate, a.frequency, a.padding)

        if (a.frameSync != '1'.repeat(11)) {
            console.log('frame error', ID3Header, a)
            break;
        }

        bitrates.push(a.bitrate)
        frequences.push(a.frequency)
        modes.push(a.mode)

        stream.read(l - 4)
    }

    let bitrate: number = 0;
    let frequency: number = 0;
    if (isLocked(bitrates)) {
        bitrate = bitrates[0]
        frequency = frequences[0]
    } else {
        bitrate = getOverage(bitrates)
        frequency = getOverage(frequences)
    }

    frequency /= 1000

    return {
        kbps: Math.ceil(bitrate),
        khz: +frequency.toFixed(1),
        mode: getMust(modes)
    }
}
