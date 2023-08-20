import { Router } from "express";
import ProductManager from "../class/ProductManager";

const prodRouter = Router();
const productManager = new ProductManager();

prodRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();

  res.status(200).send(products);
});

prodRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProdById(parseInt(pid));

  product
    ? res.status(200).send(product)
    : res.status(404).send(`Producto con el id: ${pid} no encontrado`);
});

prodRouter.post("/", async (req, res) => {
  const { code } = req.body;

  const product = await productManager.addProduct(req.body);
  if (product) {
    res.status(200).send("Producto creado exitosamente");
  } else {
    res.status(400).send(`El producto con el codigo ${code}, ya existe`);
  }
});

prodRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const productById = await productManager.getProdById(parseInt(req.params.id));

  if (productById) {
    await productManager.updateProd(parseInt(id), req.body);
    res.status(200).send(`Producto con el Id: ${productById.id} modificado`);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});
prodRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const productById = await productManager.getProdById(parseInt(req.params.id));

  if (productById) {
    await productManager.deleteProd(parseInt(id));
    res.status(200).send(`Producto con el Id: ${productById.id} eliminado`);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

export default prodRouter;
