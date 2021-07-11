import { checkUpdate } from "./functions"

(async () => {
    const { found, current, last } = await checkUpdate()

    if(!found) return;

    console.log(`[UPDATE] Доступна новая версия к скачиванию! | Текущая: ${current} | Последняя: ${last}`)
})()