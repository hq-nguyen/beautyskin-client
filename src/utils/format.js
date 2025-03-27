export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString('vi-VN', options);
};

export const formatCurrency = (amount, symbol = true) => {
    if (amount === null || amount === undefined) {
        return symbol ? '0 đ' : '0';
    }

    // Format with commas as thousand separators and periods for decimals
    const formattedAmount = Number(amount).toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // Return with currency symbol if requested
    return symbol ? `${formattedAmount} đ` : formattedAmount;
}