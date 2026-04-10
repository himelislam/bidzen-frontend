import { formatCurrency } from "@/utils/formatCurrency";

export default function PriceDisplay({ amount, className = "" }) {
  return (
    <span className={className}>
      {formatCurrency(amount)}
    </span>
  );
}
