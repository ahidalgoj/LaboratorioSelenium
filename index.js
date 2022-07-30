const {Builder, By} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs/promises');

async function extractProperties() {
  try {
    let options = new firefox.Options();
    let driver = await new Builder()
                .setChromeOptions(options)
                .forBrowser('firefox')
                .build();

    await driver.get("https://www.bnventadebienes.com/properties/search");

    let maxPrice = await driver.findElement(By.xpath("//input[@id='MaxPrice']"));
    maxPrice.sendKeys(20000000);

    let searchButton = await driver.findElement(By.xpath("//button[@class='btn btn-primary-action']"));
    await searchButton.click();

    await fs.writeFile("BNPropiedades.txt", "BN Venta de Bienes", err => {
      if (err) {
        console.error(err);
      }
    });

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

      let content = "";

      for (let i = 0; i < infoItems.length; i++) {
        const item = infoItems[i];
        
        infoChildren = await item.findElements(By.xpath("./child::*"))

        //Nueva línea para el nuevo hijo
        content += "\n";

        for (let j = 0; j < infoChildren.length; j++) {
          const child = infoChildren[j];

          childClass = await child.getAttribute("class");
          childText = await child.getText();

          content += childText;
          content += " >> "

          console.log(content);

          if (childClass==="property-item-title") {
            
          }
        }
      }

      //Extraídas las propiedades por página, escribimos al archivo
      await fs.appendFile("BNPropiedades.txt", content);

    }

    await driver.quit();

  } catch (error) {
    console.log(error)
  }
}

extractProperties();