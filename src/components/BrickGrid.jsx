import { generateRowLabels } from "../utils/rowLabels";

const cols = Array.from({ length: 34 }, (_, i) => i + 1);

export default function BrickGrid({ bricks }) {
  const rows = generateRowLabels(52); // e.g., A-Z, AA-TT

  return (
    <div className="rounded-3xl shadow-lg w-full  mx-auto h-[calc(100vh-390px)]  md:h-[calc(100vh-500px)] xl:h-[calc(100vh-300px)] overflow-auto ">
      {/* Column headers */}
      <div className="grid grid-cols-[3rem_1fr] bg-white z-10 ">
        <div className="w-12 h-12"></div> {/* top-left corner */}
        <div className="grid grid-cols-34 gap-2 min-w-max">
          {cols.map((c) => (
            <div
              key={c}
              className="flex items-center justify-center  text-gray-800/90 text-md w-12 h-12"
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Row labels + grid */}
      <div className="flex">
        {/* Row labels */}
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div
              key={r}
              className="flex items-center justify-center  text-gray-800/90 text-md w-12 h-12"
            >
              {r}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-auto min-w-max pe-4 pb-4">
          <div className="grid grid-cols-34 gap-2">
            {rows.map((r) =>
              cols.map((c) => {
                const filled = bricks.find((b) => b.row === r && b.col === c);
                return (
                  <div
                    key={`${r}${c}`}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-medium rounded-md ${
                      filled ? "bg-navy-blue" : "bg-gray-200 text-gray-600 "
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
