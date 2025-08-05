import React from 'react'

export default function PriceTable({ prices }) {
  if (!prices || prices.length === 0) return <p>無票價資訊</p>
  return (
    <table className="table table-bordered text-center mb-3">
      <thead>
        <tr>
          <th style={{ width: '45%' }}>區域</th>
          <th>票價</th>
        </tr>
      </thead>
      <tbody>
        {prices.map(p => (
          <tr key={p.section}>
            <td>{p.section}</td>
            <td>${p.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
