import { Tabletojson } from 'tabletojson';
import { saving } from './saving';
import retry from 'async-retry'

export const scrapping = async () => {
    const pages = await browser.pages();
    const page = pages[0];


    await page.waitForSelector("body > app-root > main > div")
    await page.waitForSelector("body > app-root > main > div > app-results > table")

    const tableRaw = await page.$eval('body > app-root > main > div > app-results > table', (el: any) => {
        return el.outerHTML
    })

    const table = Tabletojson.convert(tableRaw)

    // table[0].forEach((item: any) => {
    //     console.log("🚀 ~ file: scrapping.ts:16 ~ table ~ table:", item.NPI)
    // })

    console.log(table[0].length)

    for await (const i of table[0].slice(skip)) {
        try {
            await retry(async () => {
                await saving(i)
            }, {
                retries: 3
            })
        } catch (error) {
            console.log(`Error on ${i.NPI}`, error)
        }

    }


    const hasNext = await page.$eval('body > app-root > main > div > app-results > div:nth-child(8)', (el: any) => {

        const v = document.querySelector("body > app-root > main > div > app-results > div:nth-child(8) > button")

        if (v) {

            if (v.innerHTML) {
                if (v.innerHTML.includes('More')) {
                    return true
                }
            }

        }

        return false

    })

    if (hasNext) {

        await page.click('body > app-root > main > div > app-results > div:nth-child(8) > button')

        global.skip = 0
        await scrapping()
    }

    console.log(`
    =================================================
      Scraper Done 
    =================================================`)

}