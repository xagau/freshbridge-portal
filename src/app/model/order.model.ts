export interface Order {
    id: number;
    orderDate: string;
    status: string;
    items: {
        id: number;
        order: string;
        productName: string;
        productUnit: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }[];
    farmerId: number;
    restaurantId: number;
    totalAmount: number;
    deliveryAddress: string;
    expectedDeliveryDate: string;
    deliveryInstructions: string;
    paid: boolean;
    createdAt: string;
    updatedAt: string;
    startDate: string,
    frequency: string,
    repeatOnDays: string,
    openEnd: boolean,
    endDate: string
}