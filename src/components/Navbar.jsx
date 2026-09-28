import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { totalItems } = useCart();

  const navigate = useNavigate();

  const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="nav-container">

        <Link to="/home" className="logo">
          🛒 ShopZone
        </Link>

        <div className="nav-links">

          {loggedInUser ? (
            <>
              <Link to="/home">
                Home
              </Link>

              <Link to="/products">
                Products
              </Link>

              <Link to="/about">
                About
              </Link>

              <Link to="/cart" className="cart-link">
                🛍️ Cart

                <span className="cart-count">
                  {totalItems}
                </span>
              </Link>

              <span className="welcome-user">
                👋 {loggedInUser.name}
              </span>

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;