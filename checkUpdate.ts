import { checkUpdate } from "./functions"

(async () => {
    const { found, current, last } = await checkUpdate()

    if(!found) return;

    console.log(`[UPDATE] Доступна новая версия к скачиванию! | Текущая: ${current} | Последняя: ${last}`)
})().catch((err) => {
    console.error('[UPDATE] Произошла ошибка во время проверки обновлений.', err)
})