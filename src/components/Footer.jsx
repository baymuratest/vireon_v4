import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../utils/kodik';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <Link to="/" className={s.logo}>
            <img src="/logo.png" alt="Vireon" />
            <span>VIREON</span>
          </Link>
          <p>Смотри фильмы, сериалы, аниме и мультфильмы онлайн в высоком качестве. Один сервис — весь контент.</p>
        </div>

        <div className={s.col}>
          <h4>Разделы</h4>
          {CATEGORIES.map(c => (
            <Link key={c.id} to={c.id === 'all' ? '/catalog' : `/catalog?cat=${c.id}`}>
              {c.label}
            </Link>
          ))}
        </div>

        <div className={s.col}>
          <h4>Навигация</h4>
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/search">Поиск</Link>
          <Link to="/author">Автор</Link>
          <Link to="/support">Поддержать</Link>
        </div>
      </div>
      <div className={s.bottom}>
        <p>© {new Date().getFullYear()} Vireon. Все права защищены.</p>
      </div>
    </footer>
  );
}
