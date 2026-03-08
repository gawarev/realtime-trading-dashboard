import type { StockMeta } from '../types/market';

export const STOCK_LIST: StockMeta[] = [
  {
    code: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS01992.png',
  },
  {
    code: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS01052.png',
  },
  {
    code: 'TCS',
    name: 'Tata Consultancy Services',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS01489.png',
  },
  {
    code: 'INFY',
    name: 'Infosys Ltd',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS00577.png',
  },
  {
    code: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS01995.png',
  },
  {
    code: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS01216.png',
  },
  {
    code: 'ITC',
    name: 'ITC Ltd',
    logo: 'https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS00972.png',
  },
];

export const TICKER_CODES = STOCK_LIST.map(s => s.code);
