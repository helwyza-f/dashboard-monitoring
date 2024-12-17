import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  return (
    <div>
      <h1>Test id {testId}</h1>
    </div>
  );
}
