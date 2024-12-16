import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ testingId: string }>;
}) {
  const { testingId } = await params;
  return (
    <div>
      <h1>Testing {testingId}</h1>
    </div>
  );
}
