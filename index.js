core = require('@actions/core');
puppeteer = require('puppeteer');
selectors = require('./selectors.json');
codes = require('./codes.json');
require('dotenv').config()


start(JSON.parse(process.env.HOYOLAB_COOKIES));


async function start(cookies) {
    cookies = cookiesToArray(cookies)

    //* Start browser
    console.log("Trying to launch a browser");
    try {
        browser = await puppeteer.launch({ headless: true });
        page = (await browser.pages())[0];
    } catch (error) {
        console.log(error);
        core.setFailed('Failed to launch browser!');
        await closeBrowser();
        return false
    }
    url = `https://genshin.hoyoverse.com/en/gift`;

    //* An attempt to get a reward for each of the accounts
    for (let i = 0; i < cookies.length; i++) {
        console.log("");
        console.log(`Account ${i+1} of ${cookies.length}`);
        const account = cookies[i];
        console.log("Authentication attempt using cookies");
        try {
            for (let cookie of account) {
                console.log(" Setting cookies: ", cookie.name);
                page.setCookie({
                    'name': cookie.name,
                    'value': cookie.value,
                    'domain': ".hoyoverse.com"
                });
            }
        } catch (error) {
            console.log(error);
            core.setFailed('Failed to set cookies!');
            continue;
        }

        console.log("Trying to open the HoYoVerse site");
        try {
            await page.goto(url)
        } catch (error) {
            console.log(error);
            core.setFailed('The site could not be opened, please try again later');
            continue;
        }

        console.log("Check authorization status");
        try {
            let element = await page.waitForSelector(selectors.LogInOk);
            let value = await page.evaluate(el => el.textContent, element);
            if (value != selectors.LogInFailText) console.log(" Authorization was successful");
            else {
                let element = await page.waitForSelector(selectors.LogInFail);
                let value = await page.evaluate(el => el.textContent, element);
                if (value != selectors.LogInFailText) console.log(" Authorization was successful?");
                else {
                    console.log("Authorization failed.");
                    continue;
                }
            }
        } catch (error) {
            console.log(error);
            core.warning(" Unexpected error");
            continue;
        }

        console.log("CCounting available servers");
        try {
            await page.waitForSelector(selectors.server.element);
            var gameServersCounter = await page.evaluate(new Function(`return new Promise(resolve => {
                var x = document.querySelectorAll('${selectors.server.element}');
                x = x.length;
                resolve(x);
            });`));
            console.log(` Found ${gameServersCounter} game servers`);
        } catch (error) {
            console.log(error);
        }

        console.log("Checking the presence of an account on all servers");
        try {
            var gameServersWithAccounts = []
            for (let a = 0; a < gameServersCounter; a++) {
                console.log(` Checking the presence of an account on ${a+1} server`);
                await page.waitForSelector(selectors.server.btn);
                await page.click(selectors.server.btn);
                await page.evaluate(new Function(`return new Promise(resolve => {
                    document.querySelectorAll('${selectors.server.element}')[${a}].click();
                    resolve();
                });`));

                //! If it finds accounts on servers where there are none, increase the delay
                await page.waitForTimeout(2000);
                let element = await page.waitForSelector(selectors.nickname.element);
                let value = await page.evaluate(el => el.value, element);
                while (value == selectors.nickname.processing) {
                    await page.waitForTimeout(10);
                    value = await page.evaluate(el => el.textContent, element);
                }
                if (value != selectors.nickname.missing) gameServersWithAccounts.push(a);
            }
            console.log(` Found ${gameServersWithAccounts.length} servers with an account`);
        } catch (error) {
            console.log(error);
        }

        console.log("Code activation on all servers with an account");
        try {
            for (let b = 0; b < gameServersWithAccounts.length; b++) {
                // await page.click(selectors.server.btn);
                // await page.waitForTimeout(100);
                var serverName = await page.evaluate(new Function(`return new Promise(resolve => {
                    var server = document.querySelectorAll('${selectors.server.element}')[${gameServersWithAccounts[b]}];
                    server.click()
                    resolve(server.innerText.trim());
                });`));
                console.log(` Code activation on the server: ${serverName}`);
                
                for (let c = 0; c < codes.length; c++) {
                    var code = codes[c]
                    console.log(`  Processing code: ${code}`);
                    await page.reload();
                    await page.waitForTimeout(1000);

                    await page.click(selectors.server.btn);
                    await page.evaluate(new Function(`return new Promise(resolve => {
                        var server = document.querySelectorAll('${selectors.server.element}')[${gameServersWithAccounts[b]}];
                        server.click()
                        resolve(server.innerText);
                    });`));
                    await page.waitForSelector(selectors.code);
                    await page.type(selectors.code, code, {delay: 100});
                    await page.waitForTimeout(1000);
                    await page.click(selectors.submit);
                    await page.waitForTimeout(2000);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log("\nAll tasks completed.");
    await closeBrowser();
}

function cookiesToArray(cookies) {
    for (let i = 0; i < cookies.length; i++) {
        cookie = [];
        cookies[i].split(";").forEach(el => {
            a = el.split("=");
            if (a[0].length > 0) cookie.push({ name: a[0], value: a[1] });
        });
        cookies[i] = cookie;
    }
    return cookies;
}

async function closeBrowser() {
    console.log("Trying to close the browser");
    try {
        await page.close();
        await browser.close();
    } catch (error) {
        console.log(error);
        core.warning("Failed to close browser. Don't worry, it will disappear when the action is finished, it should not affect the operation of the program");
    }
    
}

module.exports.start = start;
