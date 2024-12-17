import { CardType } from "./card-type";

async function fetchTestingTypes() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/testing-type/stats`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function DashboardPage() {
  const testingTypes = await fetchTestingTypes();

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testingTypes.map((type: any) => (
          <CardType
            testId={type.typeId}
            key={type.name}
            title={type.name}
            image={type.imageUrl}
            stats={type.stats}
          />
        ))}
      </div>
    </div>
  );
}
