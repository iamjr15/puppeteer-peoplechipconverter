const args = process.argv;
const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const stealthPluggin = require("puppeteer-extra-plugin-stealth");
const axios = require("axios");
const cheerio = require("cheerio");

/*Local Files*/
const credentials = require("./login.js");
const { head } = require("shelljs");
const { url } = require("inspector");


puppeteer.use(stealthPluggin());
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

let page;

function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkStatus(){
    try{
        if(await page.waitForSelector('.docs-ui-toast-content', {timeout : 200})){
            console.log("error");
        }
    }catch(e){
        console.log("Success")
    }
}

(async function () {
   
    // That's it, the rest is puppeteer usage as normal
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--blink-setting=imagesEnabled=false', //DIsables Images
            '--no-sandbox',
        ]
    })
    page = await browser.newPage();
  let navigationPromise = page.waitForNavigation();
    await page.goto("https://sheets.new/");
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'EMAIL'); // Email login
    await page.click("#identifierNext");
    console.log("EMAIL ENTERED");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', 'PASSWORD'); // Password login
    console.log("PASSWORD ENTERED");
    await page.waitForSelector("#passwordNext", { visible: true });
    await page.click("#passwordNext");
    await page.waitForSelector('div.cell-input');
    await page.waitForTimeout(10000);
    await page.type('#t-formula-bar-input-container > div > div > div.cell-input', " palankit35@gmail.com",{delay: 600});
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowDown');
    await page.type('#t-formula-bar-input-container > div > div > div.cell-input', " palankit35@gmail.com",{delay: 600});
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowDown');
    await page.type('#t-formula-bar-input-container > div > div > div.cell-input', " palankit35@gmail.com",{delay: 600});
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowDown');
    await page.type('#t-formula-bar-input-container > div > div > div.cell-input', " palankit35@gmail.com",{delay: 600});
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1500);
    await page.keyboard.down('ControlLeft')
    await page.keyboard.down('Space')
    await page.keyboard.down('Space')
    await page.waitForTimeout(2000);

    await page.waitForTimeout('#docs-insert-menu');
    await page.click('#docs-insert-menu');
    await page.waitForTimeout(2000);
    await page.waitForSelector('div.people-chip-menu-item > div.goog-menuitem-content > span.goog-menuitem-label');
    await page.click('div.people-chip-menu-item > div.goog-menuitem-content > span.goog-menuitem-label');
    await checkStatus();

    await browser.close();
  })();
