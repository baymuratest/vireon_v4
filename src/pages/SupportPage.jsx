import React, { useState } from 'react';
import s from './SupportPage.module.css';

const WALLETS = [
  {
    id: 'usdt-trc20',
    name: 'USDT',
    network: 'TRC20 (Tron)',
    address: 'XXXXXXXXXX',
    color: '#26A17B',
    icon: '₮',
  },
];

function WalletCard({ w }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(w.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className={s.card}>
      <div className={s.head}>
        <div className={s.icon} style={{ background: w.color }}>{w.icon}</div>
        <div className={s.headText}>
          <h3>{w.name}</h3>
          <span>{w.network}</span>
        </div>
      </div>

      <div className={s.addressBox}>
        <code>{w.address}</code>
        <button onClick={copy} className={s.copyBtn}>
          {copied ? '✓ Скопировано' : 'Копировать'}
        </button>
      </div>

      <p className={s.warn}>
        ⚠ Отправляй только <b>{w.name}</b> в сети <b>{w.network}</b>.
        Перевод в другой сети будет утерян.
      </p>
    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="page-wrapper">
      <div className={`page-inner ${s.wrap}`}>
        <div className={s.hero}>
          <div className={s.heart}>❤</div>
          <h1>Поддержать автора</h1>
          <p>
            Vireon — некоммерческий проект, сделанный ради интереса.
            Если он тебе пригодился — можешь отблагодарить любой суммой.
            Каждая монета приятна и мотивирует развивать проект дальше.
          </p>
        </div>

        <div className={s.list}>
          {WALLETS.map(w => <WalletCard key={w.id} w={w} />)}
        </div>

        <p className={s.note}>
          Другие способы поддержки появятся позже. Спасибо, что ты здесь 🤍
        </p>
      </div>
    </div>
  );
}
