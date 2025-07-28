import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Import the CSS file

// Main App component for the Currency Converter
const App = () => {
    // Static exchange rates (USD as base currency for simplicity)
    // In a real application, this would come from a live API call (e.g., using fetch)
    const exchangeRates = {
        "USD": 1.0,
        "EUR": 0.92,
        "INR": 83.45,
        "JPY": 157.00,
        "GBP": 0.79,
        "AUD": 1.50,
        "CAD": 1.36,
        "CHF": 0.90,
        "CNY": 7.26,
        "SEK": 10.50,
        "NZD": 1.63,
        "SGD": 1.35,
        "HKD": 7.82,
        "KRW": 1380.00,
        "MXN": 18.00, // Mexican Peso
        "BRL": 5.00,  // Brazilian Real
        "RUB": 90.00, // Russian Ruble
        "ZAR": 18.50, // South African Rand
        "TRY": 32.00, // Turkish Lira
        "SAR": 3.75,  // Saudi Riyal
        "AED": 3.67,  // UAE Dirham
        "THB": 36.00, // Thai Baht
        "IDR": 16200.00, // Indonesian Rupiah
        "PHP": 58.00, // Philippine Peso
        "VND": 25400.00, // Vietnamese Dong
        "MYR": 4.70,  // Malaysian Ringgit
        "PLN": 4.00,  // Polish Zloty
        "NOK": 10.80, // Norwegian Krone
        "DKK": 6.80,  // Danish Krone
        "EGP": 47.00, // Egyptian Pound
        "CLP": 950.00, // Chilean Peso
        "ARS": 900.00, // Argentine Peso
        "COP": 4100.00, // Colombian Peso
        "PKR": 278.00, // Pakistani Rupee
        "BDT": 110.00, // Bangladeshi Taka
        "NPR": 133.00, // Nepalese Rupee
        "LKR": 300.00, // Sri Lankan Rupee
        "KZT": 460.00, // Kazakhstani Tenge
        "UAH": 40.00, // Ukrainian Hryvnia
        "CZK": 23.00, // Czech Koruna
        "HUF": 360.00, // Hungarian Forint
        "ILS": 3.70,  // Israeli New Shekel
        "QAR": 3.64,  // Qatari Riyal
        "KWD": 0.30,  // Kuwaiti Dinar
        "BHD": 0.37,  // Bahraini Dinar
        "OMR": 0.38,  // Omani Rial
        "JOD": 0.71,  // Jordanian Dinar
        "LBP": 15000.00 // Lebanese Pound (highly volatile, static rate for example)
    };

    // Mapping for full currency names (for display in dropdowns)
    const currencyNames = {
        "USD": "United States Dollar",
        "EUR": "Euro",
        "INR": "Indian Rupee",
        "JPY": "Japanese Yen",
        "GBP": "British Pound",
        "AUD": "Australian Dollar",
        "CAD": "Canadian Dollar",
        "CHF": "Swiss Franc",
        "CNY": "Chinese Yuan",
        "SEK": "Swedish Krona",
        "NZD": "New Zealand Dollar",
        "SGD": "Singapore Dollar",
        "HKD": "Hong Kong Dollar",
        "KRW": "South Korean Won",
        "MXN": "Mexican Peso",
        "BRL": "Brazilian Real",
        "RUB": "Russian Ruble",
        "ZAR": "South African Rand",
        "TRY": "Turkish Lira",
        "SAR": "Saudi Riyal",
        "AED": "UAE Dirham",
        "THB": "Thai Baht",
        "IDR": "Indonesian Rupiah",
        "PHP": "Philippine Peso",
        "VND": "Vietnamese Dong",
        "MYR": "Malaysian Ringgit",
        "PLN": "Polish Zloty",
        "NOK": "Norwegian Krone",
        "DKK": "Danish Krone",
        "EGP": "Egyptian Pound",
        "CLP": "Chilean Peso",
        "ARS": "Argentine Peso",
        "COP": "Colombian Peso",
        "PKR": "Pakistani Rupee",
        "BDT": "Bangladeshi Taka",
        "NPR": "Nepalese Rupee",
        "LKR": "Sri Lankan Rupee",
        "KZT": "Kazakhstani Tenge",
        "UAH": "Ukrainian Hryvnia",
        "CZK": "Czech Koruna",
        "HUF": "Hungarian Forint",
        "ILS": "Israeli New Shekel",
        "QAR": "Qatari Riyal",
        "KWD": "Kuwaiti Dinar",
        "BHD": "Bahraini Dinar",
        "OMR": "Omani Rial",
        "JOD": "Jordanian Dinar",
        "LBP": "Lebanese Pound"
    };


    // State variables for the converter
    const [amount, setAmount] = useState(1); // Amount to convert
    const [fromCurrency, setFromCurrency] = useState('INR'); // Currency to convert from
    const [toCurrency, setToCurrency] = useState('USD'); // Currency to convert to
    const [convertedAmount, setConvertedAmount] = useState('0.00 USD'); // Result of conversion
    const [exchangeRateInfo, setExchangeRateInfo] = useState(''); // Info about the current exchange rate
    const [message, setMessage] = useState({ text: '', type: '' }); // Message box state {text, type}

    /**
     * Displays a message in the message box.
     * @param {string} text - The message text to display.
     * @param {string} type - 'success', 'error', or 'info' for styling.
     */
    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
    };

    /**
     * Hides the message box.
     */
    const hideMessage = () => {
        setMessage({ text: '', type: '' });
    };

    /**
     * Performs the currency conversion based on current state values.
     */
    const convertCurrency = useCallback(() => {
        hideMessage(); // Clear previous messages

        const parsedAmount = parseFloat(amount);

        // Input validation
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            showMessage("Please enter a valid positive amount.", "error");
            setConvertedAmount('0.00 ' + toCurrency);
            setExchangeRateInfo('');
            return;
        }

        if (fromCurrency === toCurrency) {
            setConvertedAmount(`${parsedAmount.toFixed(2)} ${toCurrency}`);
            setExchangeRateInfo('Same currency selected.');
            showMessage("Converting to the same currency. No exchange needed.", "info");
            return;
        }

        // Get rates relative to USD (our base for static rates)
        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];

        if (!fromRate || !toRate) {
            showMessage("Exchange rate data not available for selected currencies.", "error");
            setConvertedAmount('0.00 ' + toCurrency);
            setExchangeRateInfo('');
            return;
        }

        // Convert amount to USD first, then to target currency
        const amountInUSD = parsedAmount / fromRate;
        const finalConvertedAmount = amountInUSD * toRate;

        setConvertedAmount(`${finalConvertedAmount.toFixed(2)} ${toCurrency}`);
        setExchangeRateInfo(`1 ${fromCurrency} = ${(toRate / fromRate).toFixed(4)} ${toCurrency}`);
        showMessage("Conversion successful!", "success");
    }, [amount, fromCurrency, toCurrency, exchangeRates]);

    // useEffect hook to run conversion when relevant state changes
    useEffect(() => {
        convertCurrency();
    }, [convertCurrency]); // Re-run when convertCurrency changes

    // Determine message box styling based on message type
    const messageBoxClasses = `mt-4 p-3 rounded-md text-sm text-center font-medium ${
        message.text ? '' : 'hidden'
    } ${
        message.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
        message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
        'bg-blue-100 border-blue-400 text-blue-700'
    }`;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl max-w-md w-full border-b-4 border-blue-600">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-sm">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">Currency Converter</span>
                </h1>

                <div className="space-y-6">
                    {/* Amount Input */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0"
                        />
                    </div>

                    {/* From Currency Selection */}
                    <div>
                        <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">From Currency:</label>
                        <select
                            id="fromCurrency"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                        >
                            <option key="INR" value="INR">
                                INR - {currencyNames["INR"] || "INR"}
                            </option>
                            {Object.keys(exchangeRates).filter(code => code !== 'INR').map(currencyCode => (
                                <option key={currencyCode} value={currencyCode}>
                                    {currencyCode} - {currencyNames[currencyCode] || currencyCode}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* To Currency Selection */}
                    <div>
                        <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">To Currency:</label>
                        <select
                            id="toCurrency"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                        >
                            <option key="INR" value="INR">
                                INR - {currencyNames["INR"] || "INR"}
                            </option>
                            {Object.keys(exchangeRates).filter(code => code !== 'INR').map(currencyCode => (
                                <option key={currencyCode} value={currencyCode}>
                                    {currencyCode} - {currencyNames[currencyCode] || currencyCode}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Result Display */}
                    <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-300 rounded-xl text-center shadow-md">
                        <p className="text-sm font-medium text-blue-800">Converted Amount:</p>
                        <p id="result" className="text-3xl font-extrabold text-purple-800 mt-2">{convertedAmount}</p>
                        <p id="exchangeRateInfo" className="text-sm text-blue-600 mt-3">{exchangeRateInfo}</p>
                    </div>

                    {/* Message Box for errors/info */}
                    <div id="messageBox" className={messageBoxClasses} role="alert">
                        {message.text}
                    </div>
                </div>

                {/* Creator Credit */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                        Created by HET SOLANKI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
