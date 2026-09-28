import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {

    fetch(`https://dummyjson.com/products/${id}`)
      .then((response) => {

        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load product.");
        setLoading(false);
      });

  }, [id]);

  if (loading) {
    return (
      <div className="status">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="details-page">

      <div className="details-image">

        <img
          src={product.thumbnail}
          alt={product.title}
        />

      </div>

      <div className="details-content">

        <p className="category">
          {product.category}
        </p>

        <h1>{product.title}</h1>

        <p className="rating">
          ⭐ {product.rating}
        </p>

        <h2 className="details-price">
          ${product.price}
        </h2>

        <p className="description">
          {product.description}
        </p>

        <p>
          <strong>Brand:</strong> {product.brand || "N/A"}
        </p>

        <p>
          <strong>Stock:</strong> {product.stock}
        </p>

        <button
          className="add-large-btn"
          onClick={() => addToCart(product)}
        >
          🛒 Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductDetails;