export interface StockItem {
    code: string;
    name: string;
    logo: string;
    currentPrice: number;
    openingPrice: number;
}

export const stockList: Array<StockItem> = [
    {
        code: "HDFCBANK",
        name: "HDFC Bank Ltd",
        logo: "https://indcdn.indmoney.com/cdn-cgi/image/quality=…money.com/public/images/instocks/1X/INDS01992.png",
        currentPrice: 857.05,
        openingPrice: 850.00
    },
    {
        code: "RELIANCE",
        name: "Reliance Industries Ltd",
        logo: "https://indcdn.indmoney.com/cdn-cgi/image/quality=90,format=auto,metadata=copyright,width=500/https://indcdn.indmoney.com/public/images/instocks/1X/INDS01052.png",
        currentPrice: 1404.80,
        openingPrice: 1397.36
    },
    {
        code: "TCS",
        name: "Tata Consultancy Services",
        logo: "https://indcdn.indmoney.com/cdn-cgi/image/quality=…money.com/public/images/instocks/1X/INDS01489.png",
        currentPrice: 3450.20,
        openingPrice: 3420.00
    },
    {
        code: "INFY",
        name: "Infosys Ltd",
        logo: "	https://indcdn.indmoney.com/cdn-cgi/image/quality=…money.com/public/images/instocks/1X/INDS00577.png",
        currentPrice: 1450.75,
        openingPrice: 1460.00
    },
    {
        code: "ICICIBANK",
        name: "ICICI Bank Ltd",
        logo: "https://indcdn.indmoney.com/cdn-cgi/image/quality=…money.com/public/images/instocks/1X/INDS01995.png",
        currentPrice: 980.50,
        openingPrice: 975.00
    },
    {
        code: "HINDUNILVR",
        name: "Hindustan Unilever Ltd",
        logo: "https://indcdn.indmoney.com/cdn-cgi/image/quality=…money.com/public/images/instocks/1X/INDS01216.png",
        currentPrice: 2500.00,
        openingPrice: 2510.00
    },
    {
        code: "ITC",
        name: "ITC Ltd",
        logo: "	https://indcdn.indmoney.com/cdn-cgi/image/quality=…money.com/public/images/instocks/1X/INDS00972.png",
        currentPrice: 445.00,
        openingPrice: 440.00
    }
];