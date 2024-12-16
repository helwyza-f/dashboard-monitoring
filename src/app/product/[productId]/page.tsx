import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return (
    <div>
      <h1>Product {productId}</h1>
    </div>
  );
}
