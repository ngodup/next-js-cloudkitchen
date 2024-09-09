import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IOrderProduct } from "@/types";

interface OrderSummaryProps {
  items: IOrderProduct[];
  total: number;
}
export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between mb-2">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="font-bold mt-4">Total: €{total.toFixed(2)}</div>
      </CardContent>
    </Card>
  );
}
