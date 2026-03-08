import { useEffect, useState } from "react";
import { StockItem } from "../Cards/StockItem";
import { stockList, type StockItem as StockItemType } from "../../data/stocks";
import './styles/index.css';

function WatchList() {
    const [watchListItems, setWatchListItems] = useState<StockItemType[]>([]);

    useEffect(() => {
        setWatchListItems(stockList);
    }, []);
    return (
        <div className="app-watchlist">
            <div className="watchlist-items">
                {watchListItems.map((item) => (<StockItem 
                    name={item.name}
                    code={item.code}
                    logo={item.logo}
                    price={item.currentPrice}
                    changePercentage={((item.currentPrice - item.openingPrice) / item.openingPrice * 100)}
                />)
                )}
            </div>
        </div>
    );
}

export default WatchList;