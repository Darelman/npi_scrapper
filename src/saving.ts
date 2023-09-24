import { Tabletojson } from 'tabletojson';
import { npiBase, npiTable } from './lib/airtable';
import { get } from "lodash"


type NPIUser = {
    NPI: string
    Name: string
    'NPI Type': string
    'Primary Practice Address': string
    Phone: string
    'Primary Taxonomy': string
}

export const saving = async (data: NPIUser) => {
    const pages = await browser.pages();
    let page = pages[1];

    if (!page) {
        page = await browser.newPage();
    } 



    await page.goto(`https://npiregistry.cms.hhs.gov/provider-view/${data.NPI}`, {
        waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('body > app-root > main > div > app-provider-view > div.jumbotron > table')

    const profileTableRaw = await page.$eval('body > app-root > main > div > app-provider-view > div.jumbotron > table', (el: any) => {
        return el.outerHTML
    })

    const tableHTML = profileTableRaw


    const profileTable = Tabletojson.convert(profileTableRaw)

    const b = profileTable[0].map((item: any) => {
        const v = Object.values(item ?? []).map((v: any) => {
            return v
        })
        return [[`${v[0]}`], v[1]]
    })

    const values = Object.fromEntries(b)
    console.log("🚀 ~ file: saving.ts:33 ~ saving ~ values:", values)

    const splitted = values['Primary Practice Address'].split('|')

    const text = values['Primary Practice Address']


    const phoneRegex = /Phone:\s+(\d{3}-\d{3}-\d{4})/;
    const faxRegex = /Fax:(\d{3}-\d{3}-\d{4})/;

    const phoneMatch = text.match(phoneRegex);
    const faxMatch = text.match(faxRegex);
    console.log("🚀 ~ file: saving.ts:54 ~ saving ~ faxMatch:", faxMatch)


    const Phone = phoneMatch[1];
    const Fax = get(faxMatch, '1') ?? get(text.match(/Fax: (\d{3}-\d{3}-\d{4})/), '1', 'N/A')
    const Name = data.Name
    const NPI_ID = data.NPI
    const Taxonomy = values['Primary Taxonomy']
    const Address = values['Primary Practice Address']

    // console.log(phoneNumber, faxNumber)


    const rec = await npiTable.select({
        filterByFormula: `({NPI_ID} = '${NPI_ID}')`
    }).all()

   
    if (rec.length > 0) {
        return 'NPI already exists'
    }
  
    await npiTable.create({
        NPI_ID, Phone, Fax, Name, Taxonomy: taxonomy, Address, State: stateName
    }, {typecast: true})
}


