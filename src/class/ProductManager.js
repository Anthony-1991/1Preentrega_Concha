import { promises as fs } from "fs";
import { join } from "path";
import { __dirname } from "../path.js";

const PATH = join(__dirname, "data", "products.json");

export default class ProductManager {
  constructor() {
    this.products = [];
  }

  async addProduct(product) {
    const products = JSON.parse(await fs.readFile(PATH, "utf-8"));
    const prodById = products.find((prod) => prod.id === product.id);
    const prodByCode = products.find((prod) => prod.code === product.code);

    if (prodById || prodByCode) {
      console.log(`El Producto ya existe`);
    } else {
      product.id = this.NextId(products);

      products.push(product);
      await fs.writeFile(PATH, JSON.stringify(products));
    }
  }

  NextId(products) {
    let nextId = products.reduce((maxId, product) => {
      return product.id > maxId ? product.id : maxId;
    }, 0);
    return nextId + 1;
  }

  async deleteProd(id) {
    const products = JSON.parse(await fs.readFile(PATH, "utf-8"));
    const prodById = products.find((prod) => prod.id === id);

    if (prodById) {
      await fs.writeFile(
        PATH,
        JSON.stringify(products.filter((prod) => prod.id !== id))
      );
      console.log(
        `El siguiente producto ${prodById.title} con el id ${id} fue eliminado correctamente`
      );
    } else {
      console.log("Producto inexistente");
    }
  }

  async updateProd(id, product) {
    const products = JSON.parse(await fs.readFile(PATH, "utf-8"));
    const index = products.findIndex((prod) => prod.id === id);

    if (index !== -1) {
      products[index].title = product.title;
      products[index].description = product.description;
      products[index].price = product.price;
      products[index].code = product.code;
      products[index].stock = product.stock;

      await fs.writeFile(PATH, JSON.stringify(products));
    } else {
      products.push(product);
    }
  }

  async getProducts(limit) {
    const products = JSON.parse(await fs.readFile(PATH, "utf-8"));
    if (limit) {
      return products.slice(0, limit);
    }
    return products;
  }

  async getProdById(id) {
    const products = JSON.parse(await fs.readFile(PATH, "utf-8"));
    const prodById = products.find((prod) => prod.id === parseInt(id));

    return prodById;
  }
}
