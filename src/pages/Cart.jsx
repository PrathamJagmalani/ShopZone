import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice
  } = useCart();

  if (cart.length === 0) {

    return (
      <div className="empty-cart">

        <h1>🛒 Your Cart is Empty</h1>

        <p>
          Add some products to your cart.
        </p>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <h1>Shopping Cart</h1>

      <div className="cart-container">

        <div className="cart-items">

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              <img
                src={item.thumbnail}
                alt={item.title}
              />

              <div className="cart-item-info">

                <h3>{item.title}</h3>

                <p>₹{(item.price * 85).toLocaleString("en-IN")}</p>

                <div className="quantity">

                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>
              <h3>
             Total: ₹{(totalPrice * 85).toLocaleString("en-IN")}
             </h3>
            </span>
          </div>

          <button
  onClick={() => navigate("/checkout")}
  className="checkout-btn"
>
  🛒 Proceed to Checkout
</button>

          <button
            className="clear-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;