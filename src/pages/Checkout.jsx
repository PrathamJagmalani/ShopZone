import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

  const [form, setForm] = useState({
    name: loggedInUser?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    if (!loggedInUser || !loggedInUser.email) {
      setError(
        "Please login again before placing your order."
      );
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    const generatedOrderId =
      "SZ" + Date.now().toString().slice(-8);

    const productList = cart
      .map(
        (item) =>
          `${item.title} x ${item.quantity} - ₹${(
            item.price *
            item.quantity *
            85
          ).toLocaleString("en-IN")}`
      )
      .join("\n");

    const orderData = {
      orderId: generatedOrderId,

      customer: {
        name: form.name,
        email: loggedInUser.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
      },

      paymentMethod:
        paymentMethod === "cod"
          ? "Cash on Delivery"
          : "Online Payment",

      items: cart,

      total: totalPrice * 85,
    };

    const templateParams = {
      to_email: loggedInUser.email,

      customer_name: form.name,

      order_id: generatedOrderId,

      products: productList,

      total_amount:
        (totalPrice * 85).toLocaleString("en-IN"),

      payment_method:
        paymentMethod === "cod"
          ? "Cash on Delivery"
          : "Online Payment",

      phone: form.phone,

      address: form.address,

      city: form.city,

      pincode: form.pincode,
    };

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        {
          publicKey: "YOUR_PUBLIC_KEY",
        }
      );

      setOrderId(generatedOrderId);

      setConfirmedOrder(orderData);

      setOrderConfirmed(true);

      clearCart();

    } catch (error) {
      console.error(
        "EmailJS Error:",
        error
      );

      setError(
        `Order could not be confirmed because the confirmation email failed to send. ${
          error?.text || ""
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================================
     EMPTY CART
  ========================================= */

  if (
    cart.length === 0 &&
    !orderConfirmed
  ) {
    return (
      <div className="empty-cart">

        <h2>
          Your cart is empty
        </h2>

        <button
          onClick={() =>
            navigate("/products")
          }
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  /* =========================================
     ORDER CONFIRMATION
  ========================================= */

  if (
    orderConfirmed &&
    confirmedOrder
  ) {
    return (
      <div className="order-confirmation">

        <div className="confirmation-icon">
          ✓
        </div>

        <h1>
          Order Confirmed!
        </h1>

        <p className="confirmation-message">
          Thank you for shopping with
          ShopZone.
        </p>

        <p>
          Your order has been successfully
          placed.
        </p>

        <div className="order-details-box">

          <p>
            <strong>
              Order ID:
            </strong>{" "}
            {confirmedOrder.orderId}
          </p>

          <p>
            <strong>
              Customer:
            </strong>{" "}
            {confirmedOrder.customer.name}
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {confirmedOrder.customer.email}
          </p>

          <p>
            <strong>
              Payment Method:
            </strong>{" "}
            {confirmedOrder.paymentMethod}
          </p>

          <p>
            <strong>
              Total Amount:
            </strong>{" "}
            ₹
            {confirmedOrder.total.toLocaleString(
              "en-IN"
            )}
          </p>

          <p>
            <strong>
              Delivery Address:
            </strong>{" "}
            {confirmedOrder.customer.address},{" "}
            {confirmedOrder.customer.city} -{" "}
            {confirmedOrder.customer.pincode}
          </p>

        </div>

        <div className="email-success-message">

          📧{" "}

          <strong>
            Confirmation email sent
            successfully!
          </strong>

          <p>
            A confirmation email has been
            sent to{" "}

            <strong>
              {confirmedOrder.customer.email}
            </strong>
          </p>

        </div>

        <p className="delivery-message">
          📦 Your order will be delivered
          soon.
        </p>

        <button
          className="checkout-btn"
          onClick={() =>
            navigate("/products")
          }
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  /* =========================================
     CHECKOUT PAGE
  ========================================= */

  return (
    <div className="checkout-container">

      {/* =====================================
          CHECKOUT FORM
      ===================================== */}

      <div className="checkout-form">

        <h2>
          Checkout
        </h2>

        <div className="email-display">

          📧 Confirmation email will be
          sent to:

          <strong>
            {loggedInUser?.email}
          </strong>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>

          <h3>
            Delivery Details
          </h3>

          {/* Name */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Phone */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* Address */}

          <div className="form-group">

            <label>
              Delivery Address
            </label>

            <textarea
              name="address"
              placeholder="Enter your delivery address"
              value={form.address}
              onChange={handleChange}
              required
            />

          </div>

          {/* City */}

          <div className="form-group">

            <label>
              City
            </label>

            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={form.city}
              onChange={handleChange}
              required
            />

          </div>

          {/* Pincode */}

          <div className="form-group">

            <label>
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              placeholder="Enter your pincode"
              value={form.pincode}
              onChange={handleChange}
              required
            />

          </div>

          {/* =================================
              PAYMENT
          ================================= */}

          <h3 className="payment-heading">
            Payment Method
          </h3>

          <div className="payment-options">

            {/* COD */}

            <label
              className={`payment-option ${
                paymentMethod === "cod"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="cod"
                checked={
                  paymentMethod === "cod"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              <div>

                <strong>
                  💵 Cash on Delivery
                </strong>

                <p>
                  Pay when your order
                  is delivered.
                </p>

              </div>

            </label>

            {/* ONLINE PAYMENT */}

            <label
              className={`payment-option ${
                paymentMethod === "online"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="online"
                checked={
                  paymentMethod === "online"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              <div>

                <strong>
                  💳 Online Payment
                </strong>

                <p>
                  Pay using UPI by
                  scanning the QR code.
                </p>

              </div>

            </label>

          </div>

          {/* =================================
              QR PAYMENT
          ================================= */}

          {paymentMethod === "online" && (
            <div className="qr-payment">

              <h3>
                Scan to Pay
              </h3>

              <img
                src={`${import.meta.env.BASE_URL}qr-code.png`}
                alt="UPI Payment QR Code"
                className="payment-qr"
              />

              <p>
                Scan this QR code using
                your UPI app.
              </p>

              <p className="payment-note">

                After completing the
                payment, click{" "}

                <strong>
                  Confirm Order
                </strong>.

              </p>

            </div>
          )}

          {/* =================================
              CONFIRM BUTTON
          ================================= */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing Order..."
              : "🛒 Confirm Order"}
          </button>

        </form>

      </div>

      {/* =====================================
          ORDER SUMMARY
      ===================================== */}

      <div className="order-summary">

        <h2>
          Order Summary
        </h2>

        {cart.map((item) => (

          <div
            className="summary-item"
            key={item.id}
          >

            <span>
              {item.title} ×{" "}
              {item.quantity}
            </span>

            <span>
              ₹
              {(
                item.price *
                item.quantity *
                85
              ).toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

        ))}

        <hr />

        <h3>
          Total: ₹
          {(
            totalPrice * 85
          ).toLocaleString(
            "en-IN"
          )}
        </h3>

      </div>

    </div>
  );
}

export default Checkout;