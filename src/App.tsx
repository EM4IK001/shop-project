import { useEffect, useState, type FC } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import ProductDetail from './pages/ProductDetail';
import './SCSS/Index.scss';

interface Product {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  stock: number;
  discountPercentage: number;
}

const ShopCatalog: FC<{ lang: 'ru' | 'en' }> = ({ lang }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [sortBy, setSortBy] = useState<string>(() => {
    return localStorage.getItem('shop_sort_by') || 'title';
  });

  useEffect(() => {
    localStorage.setItem('shop_sort_by', sortBy);
  }, [sortBy]);

  useEffect(() => {
    setLoading(true); 
    const skip = currentPage * 12;
    
    // ИСПРАВЛЕНИЕ: DummyJSON не умеет сортировать по 'title'. 
    // Если выбрано 'title', делаем обычный запрос без параметров сортировки.
    const url = sortBy === 'title'
      ? `https://dummyjson.com/products?limit=12&skip=${skip}`
      : `https://dummyjson.com/products?limit=12&skip=${skip}&sortBy=${sortBy}&order=asc`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных с сервера');
        return res.json();
      })
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentPage, sortBy]);

  return (
    <>
      <div className="shop-controls">
        <h2>{lang === 'ru' ? 'Каталог товаров' : 'Product Catalog'}</h2>
        <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <label htmlFor="sort-select">{lang === 'ru' ? 'Сортировка: ' : 'Sort by: '}</label>
            <select 
              id="sort-select" 
              value={sortBy} 
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
              className="sort-select"
            >
              <option value="title">{lang === 'ru' ? 'По названию' : 'By Title'}</option>
              <option value="price">{lang === 'ru' ? 'По цене' : 'By Price'}</option>
              <option value="stock">{lang === 'ru' ? 'По количеству' : 'By Quantity'}</option>
            </select>
          </div>
          
          <button onClick={() => { setSortBy('title'); setCurrentPage(0); }} className="reset-btn">
            🔄 {lang === 'ru' ? 'Сбросить' : 'Reset'}
          </button>
        </div>
      </div>

      {loading && <p className="status-text">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</p>}
      {error && <p className="status-text error">Error: {error}</p>}

      <div className="products-grid">
        {!loading && products.map((product) => {
          const discountPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
          return (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-link-wrapper">
              <div className="product-card-item">
                <img src={product.thumbnail} alt={product.title} className="project-card__img" />
                <div className="project-card__info">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <div className="price-box">
                      <span className="old-price">${product.price}</span>
                      <span className="new-price">${discountPrice}</span>
                      <span className="discount-tag">-{product.discountPercentage}%</span>
                    </div>
                    <div className="stock-box">
                      {lang === 'ru' ? 'Доступно: ' : 'Stock: '} <strong>{product.stock}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="pagination-container">
        <button className="page-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)}>
          {lang === 'ru' ? '← Назад' : '← Prev'}
        </button>
        <span className="page-info">{lang === 'ru' ? 'Страница' : 'Page'} {currentPage + 1} / 9</span>
        <button className="page-btn" disabled={currentPage === 8} onClick={() => setCurrentPage(prev => prev + 1)}>
          {lang === 'ru' ? 'Вперед →' : 'Next →'}
        </button>
      </div>
    </>
  );
};

const App: FC = () => {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <Header lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ShopCatalog lang={lang} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Дополнительный фоллбэк на случай кривых путей */}
          <Route path="*" element={<ShopCatalog lang={lang} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;