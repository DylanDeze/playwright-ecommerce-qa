export function parsePrice(price: string): number {
    return Number(
        price
            .replace('€', '')
            .trim()
            .replace(',', '.')
    );
}