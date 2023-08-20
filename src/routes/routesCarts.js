import { Router } from "express";

import CartManager from "../class/cart/CartManager";

const cartRouter = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).send(newCart);
});

// Listar productos en un carrito específico
cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cartId = parseInt(cid);

  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).send(`Carrito con el id: ${cartId} no encontrado`);
  } else {
    const productsInCart = cart.products;
    return res.status(200).send(productsInCart);
  }
});

// Agregar un producto a un carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const success = await cartManager.addProductToCart(
    parseInt(cid),
    parseInt(pid),
    quantity
  );

  if (!success) {
    return res.status(404).send("Carrito no creado");
  } else {
    res
      .status(200)
      .send(`Producto con id: ${pid} agregado al carrito con id: ${cid}`);
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const success = await cartManager.removeProductFromCart(
    parseInt(cid),
    parseInt(pid)
  );

  if (!success) {
    return res.status(404).send("No se pudo eliminar el producto del carrito");
  } else {
    res
      .status(200)
      .send(`Producto con id: ${pid} eliminado del carrito con id: ${cid}`);
  }
});

// Borrar un carrito
cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  const success = await cartManager.deleteCart(parseInt(cid));

  if (!success) {
    return res.status(404).send(`No se pudo borrar el carrito con id: ${cid}`);
  } else {
    res.status(200).send(`Carrito con id: ${cid} ha sido borrado`);
  }
});
cartRouter.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const success = await cartManager.updateProductQuantity(
    parseInt(cid),
    parseInt(pid),
    quantity
  );

  if (!success) {
    return res
      .status(404)
      .send("No se pudo actualizar la cantidad del producto en el carrito");
  } else {
    res
      .status(200)
      .send(
        `Cantidad del producto con id: ${pid} en el carrito con id: ${cid} actualizada`
      );
  }
});

export default cartRouter;
