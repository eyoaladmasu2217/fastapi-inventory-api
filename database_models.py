from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float

Base = declarative_base()

class Product(Base):
    __tablename__ = "Products"

    id = Column(int, primary_key= True, index=True)
    name = Column(str)
    description = Column (str)
    price = Column (float)
    quantity = Column (int)

