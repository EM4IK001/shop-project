import { useEffect, useState, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ProductInfo {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
}

const ProductDetail: FC = () => {
  const { id } = useParams<{ id: string }>(); // Забираем id из ссылки
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImg, setActiveImg] = useState<string>('');

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Товар не найден');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImg(data.images[0]); // Ставим первую картинку главной
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="status-text">Загрузка информации о товаре...</p>;
  if (!product) return <p className="status-text error">Товар не найден!</p>;

  const discountPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="back-to-shop-btn">
        ← Назад в каталог
      </button>

      <div className="detail-container">
        {/* Блок с галереей картинок */}
        <div className="images-gallery">
          <div className="main-image-wrap">
            <img src={activeImg} alt={product.title} className="main-image" />
          </div>
          <div className="thumbnails-grid">
            {product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="" 
                className={`thumb-img ${activeImg === img ? 'active' : ''}`}
                onClick={() => setActiveImg(img)}
              />
            ))}
          </div>
        </div>

        {/* Блок с описанием */}
        <div className="product-info-panel">
          <span className="category-badge">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="brand-text">Производитель: <strong>{product.brand || 'Нет бренда'}</strong></p>
          <p className="description-text">{product.description}</p>
          
          <div className="rating-stars">⭐ {product.rating} / 5</div>

          <div className="detail-price-box">
            <span className="detail-old-price">${product.price}</span>
            <div className="detail-new-row">
              <span className="detail-new-price">${discountPrice}</span>
              <span className="detail-discount">-{product.discountPercentage}%</span>
            </div>
          </div>

          <div className="detail-stock">
            Осталось на складе: <span className={product.stock > 5 ? 'in-stock' : 'low-stock'}>{product.stock} шт.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;