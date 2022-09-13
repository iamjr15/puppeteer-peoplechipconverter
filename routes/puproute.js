const express = require('express');
const Joi = require('joi');
const router = express.Router();
const args = process.argv;
const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const stealthPluggin = require("puppeteer-extra-plugin-stealth");
const axios = require("axios");
const cheerio = require("cheerio");


/* 

API ENDPOINT FOR SENDING EMAILS FOR CONVERSION

ENDPOINT: http://{YOUR DOMAIN HERE}/sendemails

BODY EXAMPLE: { emails: ["ahmed@gmail.com", "bilal@gmail.com"] }

CONSTRAINTS: Must be an array, empty array not acceptable, only "emails" key allowed.

VALIDATION: The validation is done through JOI

*/



router.post('/sendemails', async (req, res) => {

//Performing validation
const { error } = validateRequests(req.body); 
if (error) return res.status(400).send(error.details[0].message);

//Setting emails for conversion.
let emails = req.body.emails;



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
    await page.type('input[type="email"]', 'YOUR EMAIL HERE'); // Email login
    await page.click("#identifierNext");
    console.log("EMAIL ENTERED");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', 'YOUR PASSWORD HERE'); // Password login
    console.log("PASSWORD ENTERED");
    await page.waitForSelector("#passwordNext", { visible: true });
    await page.click("#passwordNext");
    await page.waitForSelector('div.cell-input');
    await page.waitForTimeout(10000);

    for(let i = 0; i < emails.length; i++) {
        await page.type('#t-formula-bar-input-container > div > div > div.cell-input', ` ${emails[i]}`,{delay: 600}); 
        await page.waitForTimeout(2000);  
        await page.keyboard.press('ArrowDown');  
    }

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

  res.status(200).send("Emails successfully sent for conversion");

})



//Function for validating body requests.
function validateRequests(requests) {
    const schema = Joi.object({
        emails: Joi.array().items(Joi.string().max(30).min(5)).min(1).required()
    })

    return schema.validate(requests);
}


module.exports = router;