export const openLink = async (url: string) => {
    const pages = await browser.pages();
    const page = pages[0];

    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('#searchdiv');

    await page.select("#enumerationType", "1: NPI-1")

    await page.type("#taxonomyDescription", taxonomy)

    const stateList = await page.$eval("#state", (el: any) => {

        let values = []


        for (let index = 0; index < el.options.length; index++) {
            const v = el.options[index].value;
            values.push(v)
        }


        return values
    })

    await page.select("#state", stateList[state])

    global.stateName = stateList[state].split(':')[1].trim()

    await page.click('#exactMatch')

    await page.click('#formButtons > button.btn.btn-primary.active')
}