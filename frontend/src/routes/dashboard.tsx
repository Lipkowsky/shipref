import ConnectRivalryBox from "../components/ConnectRivalryBox";
import RivalryCard from "../components/RivalryCard";
import { useUser } from "../context/UserContext";
import { useRivalries } from "../hook/useRivalries";

export default function DashboardPage() {
  const { user } = useUser();
  const { rivalries, refetch } = useRivalries();
  const count = rivalries.length;

  const cols =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-2 max-w-4xl mx-auto"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className="flex justify-center flex-start flex-col">
      {/* Poprawiony grid: domyślnie 1 kolumna, od md: podział 3fr i 1fr */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] text-sm p-4 gap-4">
        <div>
          <ConnectRivalryBox onSuccess={refetch} />
        </div>

        {/* Na telefonie wyśrodkuje lub wyrówna do startu, na desktopie do prawej */}
        <div className="flex items-center justify-center md:justify-end gap-4">
          <div className="rounded-md bg-black px-4 py-2 font-medium text-white h-fit w-fit">
            ID: {user?.id}
          </div>
        </div>
      </div>

      <div className={`grid gap-4 p-4 ${cols}`}>
        {rivalries.map((r) => (
          <RivalryCard key={r._id} r={r} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}
