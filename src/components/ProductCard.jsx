import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Toast from "./Toast";

function ProductCard({ product }) {

  const { addToCart } = useCart();

  const navigate = useNavigate();

  const [toast, setToast] = useState("");

  const handleAddToCart = () => {

    const loggedInUser =
      localStorage.getItem("loggedInUser");

    // User is not logged in
    if (!loggedInUser) {

      setToast("Please login to add products to your cart.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

      setTimeout(() => {
        setToast("");
      }, 2500);

      return;
    }

    // Add product
    addToCart(product);

    // Show success message
    setToast("Product added to cart!");

    // Hide message automatically
    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  return (
    <>
      {/* Toast Notification */}

      <Toast message={toast} />

      <div className="product-card">

        <div className="product-image-container">

          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-image"
          />

        </div>

        <div className="product-info">

          <p className="category">
            {product.category}
          </p>

          <h3>
            {product.title}
          </h3>

          <p className="rating">
            ⭐ {product.rating}
          </p>

          <p className="price">
            ₹
            {(product.price * 85).toLocaleString("en-IN")}
          </p>

          <div className="product-buttons">

            <Link
              to={`/product/${product.id}`}
              className="details-btn"
            >
              View Details
            </Link>

            <button
              onClick={handleAddToCart}
              className="add-btn"
            >
              🛒 Add to Cart
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default ProductCard;