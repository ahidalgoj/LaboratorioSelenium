const {Builder, By, WebElement} = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox');

(async function openFirefoxTest() {
  try {
    let options = new firefox.Options();
    let driver = await new Builder()
                .setChromeOptions(options)
                .forBrowser('firefox')
                .build();

    await driver.get('https://www.bnventadebienes.com/properties/search');

    let searchButton = await driver.findElement(By.xpath("//button[@class='btn btn-primary-action']"));
    await searchButton.click();

    // let pagination = await driver.findElement(By.xpath("//ul[@class='pagination pagination-position']"));

    // let paginationChildren = await driver.findElements(By.xpath("//ul[@class='pagination pagination-position']//child::li"));

    // let lastPage = paginationChildren[paginationChildren.length-1];
  
    // let lastPageLink = await lastPage.findElement(By.css('a'));

    // let lastPageRef = await lastPageLink.findElement(By.css('href')).getText();

    let link = await driver.findElement(By.linkText(">")).then(
      value => value.getAttribute("href")
    );
    
    let paginas = Number.parseInt(link.substring(link.lastIndexOf("=")+1,link.length));

    link = link.substring(0,link.lastIndexOf("=")+1);

    for (let index = 1; index <= paginas; index++) {
      
      await driver.get(`${link}${index.toString()}`);

    }

    await driver.quit();

  } catch (error) {
    console.log(error)
  }
})();