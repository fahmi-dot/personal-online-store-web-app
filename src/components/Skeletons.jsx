import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse flex flex-col">
      <div className="w-full h-56 bg-gray-200"></div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-5 w-4/5 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-100 rounded"></div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="w-full h-96 bg-gray-200 rounded-2xl"></div>
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-20 w-full bg-gray-100 rounded mt-2"></div>
          <div className="h-10 w-40 bg-gray-200 rounded mt-4"></div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse space-y-3">
      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
      <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
    </div>
  );
}
