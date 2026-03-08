import './styles/index.css';

export interface StockItemProps {
  logo: string;
  name: string;
  code: string;
  price: number;
  changePercentage: number;
}

export const StockItem = ({ logo, name, code, price, changePercentage }: StockItemProps) => {
  const isPositive = changePercentage >= 0;

  return (
    <div className="stock-item">
      <div className="stock-item-left">
        <img src={logo} alt={name} className="stock-logo" />
      </div>
      <div className="stock-item-middle">
        <div className="stock-name">{name}</div>
        <div className="stock-code">{code}</div>
      </div>
      <div className="stock-item-right">
        <div className="stock-price">₹{price.toFixed(2)}</div>
        <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{changePercentage.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};