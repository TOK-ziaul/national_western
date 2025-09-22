import { generateRowLabels } from "../utils/rowLabels";
import { useEffect, useRef } from "react";

export default function BrickGrid({ bricks, selectedBrick }) {
  const rows = generateRowLabels(52);
  const gridRef = useRef(null);
  const selectedBrickRef = useRef(null);
  const cols = Array.from({ length: 34 }, (_, i) => i + 1);

  // Scroll to selected brick
  useEffect(() => {
    if (selectedBrick && gridRef.current) {
      const gridContainer = gridRef.current;

      const rowIndex = rows.findIndex((row) => row === selectedBrick.row);
      const colIndex = cols.findIndex((col) => col === selectedBrick.col);

      if (rowIndex !== -1 && colIndex !== -1) {
        const rowHeight = 56; // h-12 (48px) + gap-2 (8px)
        const colWidth = 56; // w-12 (48px) + gap-2 (8px)
        const headerHeight = 56;
        const rowLabelWidth = 56;

        const targetScrollTop = headerHeight + rowIndex * rowHeight;
        const targetScrollLeft = rowLabelWidth + colIndex * colWidth;

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
      className="rounded-3xl shadow-lg w-full h-[calc(100vh-390px)] md:h-[calc(100vh-500px)] xl:h-[calc(100vh-300px)] overflow-auto"
    >
      <div className="inline-block min-w-max pe-4 pb-4">
        {/* Column headers */}
        <div className="grid md:grid-cols-[3.5rem_1fr] grid-cols-[2.5rem_1fr] sticky top-0 bg-white z-20">
          <div className="md:w-14 md:h-14 w-10 h-10"></div> {/* corner */}
          <div className="grid grid-cols-34 gap-2">
            {cols.map((c) => (
              <div
                key={c}
                className="flex items-center justify-center text-gray-800/90 text-base md:text-lg md:w-14 md:h-14 w-10 h-10 "
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Row labels + grid */}
        <div className="flex ">
          {/* Row labels */}
          <div className="flex flex-col gap-2 sticky left-0 bg-white z-10">
            {rows.map((r) => (
              <div
                key={r}
                className="flex items-center justify-center text-gray-800/90 text-base md:text-lg md:w-14 md:h-14 w-10 h-10 "
              >
                {r}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-34 gap-2">
            {rows.map((r) =>
              cols.map((c) => {
                const filled = bricks.find((b) => b.row === r && b.col === c);
                const isSelected =
                  selectedBrick?.row === r && selectedBrick?.col === c;

                return (
                  <div
                    key={`${r}${c}`}
                    ref={isSelected ? selectedBrickRef : null}
                    className={`md:w-14 md:h-14 w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md ${
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
