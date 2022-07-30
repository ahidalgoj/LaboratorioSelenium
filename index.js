const {Builder, By} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function extractBNProperties() {
  try {
    let options = new firefox.Options();
    let driver = await new Builder()
                .setChromeOptions(options)
                .forBrowser('firefox')
                .build();

    await driver.get('https://www.bnventadebienes.com/properties/search');

    let searchButton = await driver.findElement(By.xpath("//button[@class='btn btn-primary-action']"));
    await searchButton.click();

    let link = await driver.findElement(By.linkText(">")).then(
      value => value.getAttribute("href")
    );
    
    let paginas = Number.parseInt(link.substring(link.lastIndexOf("=")+1,link.length));

    link = link.substring(0,link.lastIndexOf("=")+1);

    let infoItems;
    let infoChildren;
    let childClass;
    let childText;

    for (let index = 1; index <= paginas; index++) {
      
      //Cargar una página de resultados según el índice
      await driver.get(`${link}${index.toString()}`);

      //Se extraen todos los elementos con la información de las propiedades
      infoItems = await driver.findElements(By.xpath("//div[@class='property-item-info col-xs-12 col-sm-12 col-md-12']"))


      for (let i = 0; i < infoItems.length; i++) {
        const item = infoItems[i];
        
        infoChildren = await item.findElements(By.xpath("./child::*"))

        for (let j = 0; j < infoChildren.length; j++) {
          const child = infoChildren[j];

          childClass = await child.getAttribute("class");
          childText = await child.getText();

          console.log("Class: "+childClass+", Text: "+childText);

          if (childClass==="property-item-title") {
            
          }
        }
      }

    }

    await driver.quit();

  } catch (error) {
    console.log(error)
  }
}

extractBNProperties();