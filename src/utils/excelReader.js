import * as XLSX from "xlsx";

export const readExcelFile = async (filePath) => {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Get raw JSON
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  // Normalize: skip first 2 header rows
  const cleaned = raw.slice(2).map((row) => ({
    id: row["Master Brick Tracker "] || row["GIFT ID"],
    firstName: row["__EMPTY_1"] || row["First Name"],
    lastName: row["__EMPTY_2"] || row["Last Name"],
    inscription: row["__EMPTY_3"] || row["Brick Line 1"],
    inscription2: row["__EMPTY_4"] || row["Line 2"] || "",
  }));

  return cleaned;
};

// Parser for brick grid layout
export const readBrickLayout = async (filePath) => {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Get raw 2D array (rows/columns)
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const bricks = [];

  for (let r = 1; r < raw.length; r++) {
    const row = raw[r];
    for (let c = 1; c < row.length; c++) {
      const giftId = row[c];
      if (giftId) {
        bricks.push({
          giftId: String(giftId).trim(),
          row: r, // numeric row
          col: c, // numeric col
        });
      }
    }
  }

  return bricks;
};
