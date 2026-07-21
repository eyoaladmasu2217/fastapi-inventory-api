from fastapi import FastAPI
from models import Product
app = FastAPI()

@app.get("/")
def greet(): 
    return "Welcome here!"

products = [
    Product(id=1, name="phone", description="budget phone", price=1000, quantity=10),
    Product(id=2, name="laptop", description="budget laptop", price=2000, quantity=10),
    Product(id=3, name="mouse", description="budget mouse", price=3000, quantity=10),
    Product(id=4, name="keyboard", description="budget keyboard", price=4000, quantity=1)

] 

@app.get("/products")
def get_all_products():
    return products

@app.get("/product/{id}")
def get_product_by_id(id: int):
    for product in products:
        if product.id == id:
            return product

    return "product not found"

@app.post("/product/{id}")
def add_product(product: Product):
    products.append(product)
    return product

@app.put("/product")
def update_product(id:int, product: Product):
    for i in range (len(products)):
        if products[i].id == id:
            products[i] = product
            return "product update successfully"
    return "product not found"

@app.delete("/product{id}")
def delete_product(id:int):
     for i in range(len(products)):
        if products[i].id == id:
            del products[i]
            return "product delete successfully"
     return "product not found" 
            
