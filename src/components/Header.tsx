import { type FC } from 'react';

interface HeaderProps {
  lang: 'ru' | 'en';
  setLang: (lang: 'ru' | 'en') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: FC<HeaderProps> = ({ lang, setLang, theme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="header__logo">
        🛒 {lang === 'ru' ? 'Мой Магазин' : 'My Shop'}
      </div>

      <div className="header__controls">
        <div className="header__lang">
          <button 
            className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} 
            onClick={() => setLang('ru')}
          >
            RU
          </button>
          <button 
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
};

export default Header;