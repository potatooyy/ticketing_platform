// src/components/booking/PriceTable.js
export default function PriceTable({ pricing }) {
  if (!pricing || Object.keys(pricing).length === 0) {
    return <p className="text-center text-muted">尚無票價資訊</p>
  }
  return (
    <table className="table table-bordered text-center ticket-price-table mb-4" aria-label="票價表格">
      <tbody>
        {Object.entries(pricing).map(([zone, price]) => (
          <tr key={zone}>
            <td className={`zone-${zone}`} scope="row">{zone}區</td>
            <td>{price}元</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
