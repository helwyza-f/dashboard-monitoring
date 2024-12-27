import axios from "axios";
import { CardType } from "./card-type";

interface TestingTypeStats {
  typeId: string;
  name: string;
  imageUrl: string;
  stats: {
    total: number;
    inProgress: number;
    finished: number;
  };
}

async function fetchTestingTypes() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/testing-type/stats`,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );

  return res.data;
}

export default async function DashboardPage() {
  const testingTypes = await fetchTestingTypes();

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testingTypes.map((type: TestingTypeStats) => (
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
