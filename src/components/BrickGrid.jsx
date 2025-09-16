import { generateRowLabels } from "../utils/rowLabels";

const cols = Array.from({ length: 34 }, (_, i) => i + 1);

export default function BrickGrid({ bricks }) {
  const rows = generateRowLabels(46); // Generate 34 rows: A, B, C... Z, AA, BB, CC... TT

  // Generate sample gift IDs for demonstration
  const generateGiftId = (row, col) => {
    const rowNum = rows.indexOf(row) + 1;
    return (rowNum - 1) * 34 + col;
  };

  return (
    <div className="p-2 rounded-b-3xl shadow-md">
      <div className="grid grid-cols-[auto_1fr] gap-3">
        {/* Row labels */}
        <div className="grid grid-rows-[repeat(35,2rem)] gap-2">
          <div /> {/* top-left corner blank */}
          {rows.map((r) => (
            <div
              key={r}
              className="flex items-center justify-center font-bold text-gray-800 text-sm"
            >
              {r}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-auto">
          <div className="grid grid-cols-34 gap-2">
            {/* Column labels */}
            {cols.map((c) => (
              <div
                key={c}
                className="flex items-center justify-center font-bold text-gray-800 text-sm h-8"
              >
                {c}
              </div>
            ))}

            {/* Bricks with Gift IDs */}
            {rows.map((r) =>
              cols.map((c) => {
                const filled = bricks.find((b) => b.row === r && b.col === c);

                return (
                  <div
                    key={`${r}${c}`}
                    className={`w-8 h-8  flex items-center justify-center text-xs font-medium rounded-md ${
                      filled
                        ? "bg-navy-blue"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Checkboxes below the grid */}
      {/* <div className="mt-6 flex justify-center space-x-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            defaultChecked
          />
          <span className="text-sm text-gray-700">Show All Bricks</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">Show Available Bricks</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">Show Placed Bricks</span>
        </label>
      </div> */}
    </div>
  );
}
