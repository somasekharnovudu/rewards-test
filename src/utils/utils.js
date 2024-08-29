export const formatCurrency = (amount) => {
    const formatConfig = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    return formatConfig.format(amount)
}

