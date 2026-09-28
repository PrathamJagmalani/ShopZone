import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from API
  useEffect(() => {

    fetch("https://dummyjson.com/products?limit=194")
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load products.");
        setLoading(false);
      });

  }, []);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category))
  ];

  // Search and category filtering
  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="status">
        <h2>Loading products...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status error">
        <h2>⚠️ {error}</h2>
      </div>
    );
  }

  return (
    <div className="products-page">

      <h1>Product Catalog</h1>

      <p className="page-description">
        Browse and explore our products.
      </p>

      {/* Search and filter */}

      <div className="filters">

        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >

          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item === "all"
                ? "All Categories"
                : item}
            </option>
          ))}

        </select>

      </div>

      {/* Product list */}

      {filteredProducts.length === 0 ? (

        <div className="status">
          <h2>No products found</h2>
          <p>Try another search.</p>
        </div>

      ) : (

        <div className="product-grid">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      )}

    </div>
  );
}

export default Products;