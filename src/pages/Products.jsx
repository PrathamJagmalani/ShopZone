import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 24;

  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const originalProducts = data.products || [];

        if (originalProducts.length === 0) {
          throw new Error("No products found");
        }

        /*
          Create 1000 catalog entries
          using the original DummyJSON products.

          Original images are preserved.
        */

        const generatedProducts = [];

        for (let i = 0; i < 1000; i++) {
          const original =
            originalProducts[
              i % originalProducts.length
            ];

          const edition =
            Math.floor(
              i / originalProducts.length
            ) + 1;

          /* -----------------------------
             Product title
          ----------------------------- */

          let title = original.title;

          if (edition > 1) {
            title = `${original.title} - Edition ${edition}`;
          }

          /* -----------------------------
             Price variation
          ----------------------------- */

          const priceMultiplier =
            0.9 + ((i % 20) / 100);

          const price = Number(
            (
              original.price *
              priceMultiplier
            ).toFixed(2)
          );

          /* -----------------------------
             Rating variation
          ----------------------------- */

          const ratingVariation =
            ((i % 5) - 2) * 0.1;

          const rating = Number(
            Math.min(
              5,
              Math.max(
                1,
                original.rating +
                  ratingVariation
              )
            ).toFixed(1)
          );

          /* -----------------------------
             Create product
          ----------------------------- */

          generatedProducts.push({
            ...original,

            /*
              Important:
              Every generated product
              receives a unique ID.
            */
            id: i + 1,

            title,

            price,

            rating,

            /*
              Keep original DummyJSON
              product photos.
            */
            thumbnail: original.thumbnail,

            images: original.images,
          });
        }

        setProducts(generatedProducts);
      } catch (err) {
        console.error(
          "Product loading error:",
          err
        );

        setError(
          "Unable to load products. Please check your internet connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products.map(
          (product) => product.category
        )
      ),
    ];

    return ["all", ...uniqueCategories];
  }, [products]);

  /* =========================================
     FILTER + SEARCH + SORT
  ========================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Category */

    if (category !== "all") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    /* Search */

    if (search.trim() !== "") {
      const searchText =
        search.toLowerCase().trim();

      result = result.filter(
        (product) => {
          const title =
            product.title?.toLowerCase() || "";

          const description =
            product.description?.toLowerCase() ||
            "";

          const productCategory =
            product.category?.toLowerCase() || "";

          const brand =
            product.brand?.toLowerCase() || "";

          return (
            title.includes(searchText) ||
            description.includes(searchText) ||
            productCategory.includes(searchText) ||
            brand.includes(searchText)
          );
        }
      );
    }

    /* Sorting */

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  /* =========================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    sort,
  ]);

  /* =========================================
     PAGE CHANGE
  ========================================= */

  const changePage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>

        <h2>
          Loading products...
        </h2>

        <p>
          Please wait while the catalog
          is loading.
        </p>
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="error-container">
        <h2>
          ⚠️ Something went wrong
        </h2>

        <p>{error}</p>

        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>
      </div>
    );
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  return (
    <div className="products-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="products-header">

        <h1>Our Products</h1>

        <p>
          Explore our collection of
          quality products
        </p>

      </div>

      {/* =====================================
          SEARCH + FILTERS
      ===================================== */}

      <div className="product-controls">

        {/* Search */}

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search products, brands or categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* Category */}

        <div className="filter-box">

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="all">
              All Categories
            </option>

            {categories
              .filter(
                (cat) => cat !== "all"
              )
              .map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat
                    .charAt(0)
                    .toUpperCase() +
                    cat.slice(1)}
                </option>
              ))}

          </select>

        </div>

        {/* Sort */}

        <div className="filter-box">

          <label>
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >

            <option value="default">
              Default
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="name">
              Name: A-Z
            </option>

          </select>

        </div>

      </div>

      {/* =====================================
          RESULT INFORMATION
      ===================================== */}

      <div className="products-info">

        {filteredProducts.length > 0 ? (
          <p>
            Showing{" "}
            <strong>
              {startIndex + 1}
            </strong>

            {" - "}

            <strong>
              {Math.min(
                startIndex +
                  productsPerPage,
                filteredProducts.length
              )}
            </strong>

            {" "}products
          </p>
        ) : (
          <p>
            No products found
          </p>
        )}

      </div>

      {/* =====================================
          PRODUCT GRID
      ===================================== */}

      {currentProducts.length > 0 ? (

        <div className="product-grid">

          {currentProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}

        </div>

      ) : (

        <div className="no-products">

          <div className="no-products-icon">
            🔍
          </div>

          <h2>
            No products found
          </h2>

          <p>
            Try changing your search
            or category filter.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
              setSort("default");
            }}
          >
            Clear Filters
          </button>

        </div>

      )}

      {/* =====================================
          PAGINATION
      ===================================== */}

      {totalPages > 1 && (

        <div className="pagination">

          {/* Previous */}

          <button
            className="pagination-btn"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              changePage(
                currentPage - 1
              )
            }
          >
            ← Previous
          </button>

          {/* Page Numbers */}

          <div className="page-numbers">

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            )
              .filter((page) => {

                /*
                  Show all pages when
                  there are only a few.
                */

                if (totalPages <= 7) {
                  return true;
                }

                /*
                  Always show first page.
                */

                if (page === 1) {
                  return true;
                }

                /*
                  Always show last page.
                */

                if (
                  page === totalPages
                ) {
                  return true;
                }

                /*
                  Show pages around
                  current page.
                */

                if (
                  page >=
                    currentPage - 2 &&
                  page <=
                    currentPage + 2
                ) {
                  return true;
                }

                return false;
              })
              .map(
                (
                  page,
                  index,
                  visiblePages
                ) => {

                  const previousPage =
                    visiblePages[
                      index - 1
                    ];

                  return (
                    <span
                      key={page}
                    >

                      {previousPage &&
                        page -
                          previousPage >
                          1 && (
                          <span className="pagination-dots">
                            ...
                          </span>
                        )}

                      <button
                        className={`page-btn ${
                          currentPage ===
                          page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          changePage(page)
                        }
                      >
                        {page}
                      </button>

                    </span>
                  );
                }
              )}

          </div>

          {/* Next */}

          <button
            className="pagination-btn"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              changePage(
                currentPage + 1
              )
            }
          >
            Next →
          </button>

        </div>

      )}

    </div>
  );
}

export default Products;