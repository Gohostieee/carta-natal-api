const express = require('express');
const puppeteer = require('puppeteer')

const app = express();
const port = 5500;
const browser = new Browser();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

function getElementsByText(str, tag = 'a') {
}

function Browser() {
    {
        this.currPage = 0;
        this.shell = null,
            this.page = [],
            this.initiated = false,
            this.init = async x => {
                this.shell = await puppeteer.launch({headless: false}).finally(x => {
                    this.initiated = true
                })
            }
    }
}

app.post('/get_carta', async (req, res) => {
    console.log(req.body)
    console.log(req.body.nombre)
    let resp = "kys"
    await browser.page[browser.currPage].goto("https://carta-natal.es/carta.php").finally(async x => {
        console.log("wjat")
        browser.page[browser.currPage].addScriptTag({path: "jquery.js"})
        browser.page[browser.currPage].exposeFunction("findPais", x => {
            return Array.prototype.slice.call(document.getElementsByTagName("option")).filter(el => el.textContent.trim() === x.trim())[0];

        });

        await browser.page[browser.currPage].evaluate(async body => {

            const sleep = ms => new Promise(r => setTimeout(r, ms));
            document.getElementById("nombre").value = body.nombre
            document.getElementById("fecha").value = body.fecha
            document.getElementById("hora").value = body.hora
            Array.prototype.slice.call(document.getElementsByTagName("option")).filter(el => el.textContent.trim() === body.pais.trim())[0].selected = 'selected'
            await $("#Pais").trigger("onchange")
            await sleep(1000)

            document.getElementById("n1").children[1].selected = 'selected'
            document.getElementsByName("ok")[0].click()


        }, req.body).then(async x => {

            setTimeout(async x => {
                await browser.page[browser.currPage].click("#select-ciudad")


                await browser.page[browser.currPage].evaluate(body => {
                    document.getElementById("ui-id-1").getElementsByTagName("a")[0].click()
                    document.getElementsByName("ok")[0].click()

                }, req.body)
            }, 3000)
        })


    })
    res.send(resp)


});
browser.init().finally(async x => {

    browser.page[browser.page.length] = await browser.shell.newPage().finally(x => {
        app.listen(
            port, () => console.log('Listening on port:' + port))

    })

})

