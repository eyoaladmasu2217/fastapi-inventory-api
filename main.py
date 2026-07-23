from fastapi import FastAPI, Depends
from models import Product
import database_models
from database import SessionLocal, engine
from sqlalchemy.orm import Session


app = FastAPI()

database_models.Base.metadata.create_all(bind=engine)


@app.get("/")
def greet(): 
    return "Welcome here!"

products = [
    Product(id=1, name="phone", description="budget phone", price=1000, quantity=10),
    Product(id=2, name="laptop", description="budget laptop", price=2000, quantity=10),
    Product(id=3, name="mouse", description="budget mouse", price=3000, quantity=10),
    Product(id=4, name="keyboard", description="budget keyboard", price=4000, quantity=1)

] 
#below is where we write the databse connection function to connect to the database and close the connection after the operation is done so we dont have to write the db connection everywhere in the code we can just call this function to connect to the database and close the connection after the operation is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




#below is how we sent the list of data above to my backend using A fuction called init_db()
def init_db():
    db = SessionLocal()

    count = db.query(database_models.Product).count()

    if count == 0: 
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()

init_db()


@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    
    db_products = db.query(database_models.Product).all()

    return db_products

@app.get("/product/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first() 
    if db_product:
        return db_product
    return "product not found"

@app.post("/product/{id}")
def add_product(product: Product, db: Session = Depends(get_db)):
    db.add(database_models.Product(**product.model_dump()))
    db.commit()
    return product

@app.put("/product")
def update_product(id:int, product: Product,  db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return "product updated successfully"
    return "product not found"

@app.delete("/product{id}")
def delete_product(id:int, db: Session = Depends(get_db)):
     db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
     if db_product:
        db.delete(db_product)
        db.commit()
        return "product deleted successfully"
     return "product not found" 


