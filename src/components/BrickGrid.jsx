import { generateRowLabels } from "../utils/rowLabels";
import { useEffect, useRef } from "react";

const cols = Array.from({ length: 34 }, (_, i) => i + 1);

export default function BrickGrid({ bricks, selectedBrick }) {
  const rows = generateRowLabels(52); // e.g., A-Z, AA-TT
  const gridRef = useRef(null);
  const selectedBrickRef = useRef(null);

  // Scroll to selected brick when it changes
  useEffect(() => {
    if (selectedBrick && gridRef.current) {
      const gridContainer = gridRef.current;

      // Find the row and column indices for the selected brick
      const rowIndex = rows.findIndex((row) => row === selectedBrick.row);
      const colIndex = cols.findIndex((col) => col === selectedBrick.col);

      if (rowIndex !== -1 && colIndex !== -1) {
        // Calculate the position based on grid structure
        // Each row has height of 48px (h-12) + 8px gap (gap-2) = 56px total
        const rowHeight = 56; // 48px (h-12) + 8px gap
        const headerHeight = 48; // Height of column headers

        // Each column has width of 48px (w-12) + 8px gap (gap-2) = 56px total
        const colWidth = 56; // 48px (w-12) + 8px gap
        const rowLabelWidth = 48; // Width of row labels

        // Calculate the target scroll positions
        const targetScrollTop = headerHeight + rowIndex * rowHeight;
        const targetScrollLeft = rowLabelWidth + colIndex * colWidth;

        // Get container dimensions to center the brick
        const containerHeight = gridContainer.clientHeight;
        const containerWidth = gridContainer.clientWidth;

        const centeredScrollTop =
          targetScrollTop - containerHeight / 2 + rowHeight / 2;
        const centeredScrollLeft =
          targetScrollLeft - containerWidth / 2 + colWidth / 2;

        gridContainer.scrollTo({
          top: Math.max(0, centeredScrollTop),
          left: Math.max(0, centeredScrollLeft),
          behavior: "smooth",
        });
      }
    }
  }, [selectedBrick, rows, cols]);

  return (
    <div
      ref={gridRef}
      className="rounded-3xl shadow-lg w-full  mx-auto h-[calc(100vh-390px)]  md:h-[calc(100vh-500px)] xl:h-[calc(100vh-300px)] overflow-auto "
    >
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
                const isSelected =
                  selectedBrick &&
                  selectedBrick.row === r &&
                  selectedBrick.col === c;

                return (
                  <div
                    key={`${r}${c}`}
                    ref={isSelected ? selectedBrickRef : null}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-medium rounded-md ${
                      filled
                        ? isSelected
                          ? "bg-blue-600 ring-4 ring-blue-300 shadow-lg"
                          : "bg-navy-blue"
                        : "bg-gray-200 text-gray-600"
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
