import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      <section className="hero">

        <div className="hero-content">

          <h1>
            Welcome to ShopZone
          </h1>

          <p>
            Explore products from different categories
            in our online product catalog.
          </p>

          <Link
            to="/products"
            className="shop-btn"
          >
            Explore Products
          </Link>

        </div>

      </section>

      <section className="features">

        <div className="feature">
          <div>🚚</div>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable delivery.</p>
        </div>

        <div className="feature">
          <div>🔒</div>
          <h3>Secure Shopping</h3>
          <p>Safe and simple shopping experience.</p>
        </div>

        <div className="feature">
          <div>⭐</div>
          <h3>Quality Products</h3>
          <p>Browse products with ratings.</p>
        </div>

      </section>

    </div>
  );
}

export default Home;