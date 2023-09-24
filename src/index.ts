import puppeteer from "puppeteer";
import { openLink } from "./open-link";
import { scrapping } from "./scrapping";
import { saving } from "./saving";
import { npiTable } from "./lib/airtable";



(async () => {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'production' ? 'new' : false,
    devtools: false,
    slowMo: 50
    ////executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });

  //globalThis.browser = browser
  global.browser = browser

  global.YeheyLogistic = false

  console.log(`
=================================================
  Scraper Running
=================================================`)

  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    if (browser) {
      browser.close()
    }
    process.exit(0)
  })



  // Settings
  global.taxonomy = "urology"
  global.state = 5
  global.skip = 100


  await openLink('https://npiregistry.cms.hhs.gov/search')

  await scrapping()



  // await saving('1013983386')

})()


// patSZKQZ5fl8L5Ahd.6f9167e47bb868faecc218d725cfae35c4175d5ca83b93ed28cb335fa6778893