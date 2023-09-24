import { Browser } from "puppeteer";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
  var browser: Browser
  var YeheyLogistic: boolean
  var taxonomy: string
  var state: number
  var stateName: string
  var skip: number
   
}



export { };