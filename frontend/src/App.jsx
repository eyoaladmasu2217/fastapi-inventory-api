import { useEffect, useMemo, useState } from 'react';

const initialProduct = {
  id: '',
  name: '',
  description: '',
  price: '',
  quantity: '',
};

function App() {
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:8000');
  const [products, setProducts] = useState([]);
  const [findId, setFindId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [addProductData, setAddProductData] = useState(initialProduct);
  const [updateProductData, setUpdateProductData] = useState(initialProduct);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const apiBase = useMemo(() => baseUrl.replace(/\/+$/, ''), [baseUrl]);

  const apiUrl = (path) => `${apiBase}${path}`;

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  const fetchProducts = async () => {
    showMessage('Loading products...', 'info');
    try {
      const response = await fetch(apiUrl('/products'));
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      showMessage('Products loaded successfully.', 'success');
    } catch (error) {
      showMessage(`Unable to load products: ${error.message}`, 'error');
    }
  };

  const fetchProductById = async () => {
    if (!findId) {
      showMessage('Enter a product ID to fetch.', 'error');
      return;
    }

    showMessage('Loading product...', 'info');
    try {
      const response = await fetch(apiUrl(`/product/${findId}`));
      const data = await response.json();
      if (!response.ok) {
        showMessage(data.detail || JSON.stringify(data), 'error');
        setSelectedProduct(null);
      } else {
        setSelectedProduct(data);
        showMessage(`Product ${findId} loaded.`, 'success');
      }
    } catch (error) {
      showMessage(`Unable to load product: ${error.message}`, 'error');
    }
  };

  const addProduct = async () => {
    const parsedProduct = {
      id: Number(addProductData.id),
      name: addProductData.name,
      description: addProductData.description,
      price: Number(addProductData.price),
      quantity: Number(addProductData.quantity),
    };

    if (Object.values(parsedProduct).some((value) => value === '' || Number.isNaN(value) && typeof value !== 'string')) {
      showMessage('Fill every add-product field with valid values.', 'error');
      return;
    }

    showMessage('Adding product...', 'info');
    try {
      const response = await fetch(apiUrl(`/product/${parsedProduct.id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedProduct),
      });
      const data = await response.json();
      if (!response.ok) {
        showMessage(data.detail || JSON.stringify(data), 'error');
      } else {
        showMessage(`Product ${parsedProduct.id} added successfully.`, 'success');
        setAddProductData(initialProduct);
        fetchProducts();
      }
    } catch (error) {
      showMessage(`Unable to add product: ${error.message}`, 'error');
    }
  };

  const updateProduct = async () => {
    const parsedProduct = {
      id: Number(updateProductData.id),
      name: updateProductData.name,
      description: updateProductData.description,
      price: Number(updateProductData.price),
      quantity: Number(updateProductData.quantity),
    };

    if (Object.values(parsedProduct).some((value) => value === '' || Number.isNaN(value) && typeof value !== 'string')) {
      showMessage('Fill every update-product field with valid values.', 'error');
      return;
    }

    showMessage('Updating product...', 'info');
    try {
      const response = await fetch(apiUrl(`/product?id=${parsedProduct.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedProduct),
      });
      const data = await response.text();
      if (!response.ok) {
        showMessage(data || 'Update failed.', 'error');
      } else {
        showMessage(data || `Product ${parsedProduct.id} updated.`, 'success');
        setUpdateProductData(initialProduct);
        fetchProducts();
      }
    } catch (error) {
      showMessage(`Unable to update product: ${error.message}`, 'error');
    }
  };

  const deleteProduct = async () => {
    if (!deleteId) {
      showMessage('Enter a product ID to delete.', 'error');
      return;
    }

    showMessage('Deleting product...', 'info');
    try {
      const response = await fetch(apiUrl(`/product${deleteId}`), {
        method: 'DELETE',
      });
      const data = await response.text();
      if (!response.ok) {
        showMessage(data || 'Delete failed.', 'error');
      } else {
        showMessage(data || `Product ${deleteId} deleted.`, 'success');
        setDeleteId('');
        fetchProducts();
      }
    } catch (error) {
      showMessage(`Unable to delete product: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [baseUrl]);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>FastAPI React Frontend</h1>
          <p>Use this React app to learn how your frontend connects to the FastAPI backend.</p>
        </div>
      </header>

      <section className="card">
        <div className="settings">
          <label>API Base URL</label>
          <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
          <button type="button" onClick={fetchProducts}>Refresh</button>
        </div>
        <div className={`banner ${messageType}`}>{message || 'Ready.'}</div>
      </section>

      <section className="card">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="grid two-columns">
        <div className="card">
          <h2>Find product</h2>
          <label>Product ID</label>
          <input value={findId} onChange={(event) => setFindId(event.target.value)} />
          <button type="button" onClick={fetchProductById}>Fetch</button>
          <pre className="details">{selectedProduct ? JSON.stringify(selectedProduct, null, 2) : 'No product loaded.'}</pre>
        </div>

        <div className="card">
          <h2>Delete product</h2>
          <label>Product ID</label>
          <input value={deleteId} onChange={(event) => setDeleteId(event.target.value)} />
          <button type="button" onClick={deleteProduct}>Delete</button>
        </div>
      </section>

      <section className="grid two-columns">
        <div className="card">
          <h2>Add product</h2>
          <label>ID</label>
          <input value={addProductData.id} onChange={(event) => setAddProductData({ ...addProductData, id: event.target.value })} />
          <label>Name</label>
          <input value={addProductData.name} onChange={(event) => setAddProductData({ ...addProductData, name: event.target.value })} />
          <label>Description</label>
          <input value={addProductData.description} onChange={(event) => setAddProductData({ ...addProductData, description: event.target.value })} />
          <label>Price</label>
          <input value={addProductData.price} onChange={(event) => setAddProductData({ ...addProductData, price: event.target.value })} />
          <label>Quantity</label>
          <input value={addProductData.quantity} onChange={(event) => setAddProductData({ ...addProductData, quantity: event.target.value })} />
          <button type="button" onClick={addProduct}>Add</button>
        </div>

        <div className="card">
          <h2>Update product</h2>
          <label>ID</label>
          <input value={updateProductData.id} onChange={(event) => setUpdateProductData({ ...updateProductData, id: event.target.value })} />
          <label>Name</label>
          <input value={updateProductData.name} onChange={(event) => setUpdateProductData({ ...updateProductData, name: event.target.value })} />
          <label>Description</label>
          <input value={updateProductData.description} onChange={(event) => setUpdateProductData({ ...updateProductData, description: event.target.value })} />
          <label>Price</label>
          <input value={updateProductData.price} onChange={(event) => setUpdateProductData({ ...updateProductData, price: event.target.value })} />
          <label>Quantity</label>
          <input value={updateProductData.quantity} onChange={(event) => setUpdateProductData({ ...updateProductData, quantity: event.target.value })} />
          <button type="button" onClick={updateProduct}>Update</button>
        </div>
      </section>
    </div>
  );
}

export default App;
