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
        return symbol ? 'đ0' : '0';
    };

    const formattedAmount = Number(amount).toLocaleString('vi-VN', { minimumFractionDigits: 2 });

    return symbol ? `${formattedAmount} đ` : formattedAmount;
}