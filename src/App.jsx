import Layout from "./components/ui/Layout";
import "./index.css";
import { useEffect, useState } from "react";
import LegacySearchForm from "./components/LegacySearchForm";
import BrickGrid from "./components/BrickGrid";
import ResultsTable from "./components/ResultsTable";
import BrickPlacementHeader from "./components/BrickPlacementHeader";
import { readBrickLayout, readExcelFile } from "./utils/excelReader";
import { numberToLetter } from "./utils/rowLabels";

function App() {
  const [users, setUsers] = useState([]);
  const [bricks, setBricks] = useState([]);
  const [results, setResults] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedBrick, setSelectedBrick] = useState(null);
  const [isSimilarResults, setIsSimilarResults] = useState(false);
  const [searchContext, setSearchContext] = useState({
    value: "",
    filter: "",
  });

  // Load Excel data
  useEffect(() => {
    const loadData = async () => {
      const usersData = await readExcelFile("/Users List.xlsx");
      const bricksData = await readBrickLayout("/Brick Layout Excel.xlsx");

      const normalizedBricks = bricksData.map((b) => ({
        ...b,
        row: numberToLetter(b.row), // convert row → letter(s)
        col: b.col,
      }));

      setUsers(usersData);
      setBricks(normalizedBricks);
    };

    loadData();
  }, []);

  const extractGiftId = (val) => {
    const match = String(val).match(/^\d+/);
    return match ? match[0] : null;
  };

  // --- Helpers ---
  const mapWithBricks = (filteredUsers) =>
    filteredUsers.map((u) => {
      const inscriptionWords = u.inscription
        ? u.inscription.toLowerCase().split(/\s+/).filter(Boolean)
        : [];

      const brick = bricks.find((b) => {
        if (extractGiftId(b.giftId) === String(u.id)) {
          if (
            inscriptionWords.some((word) =>
              String(b.giftId).toLowerCase().includes(word)
            )
          ) {
            return true;
          }
        }

        return String(b.giftId) === String(u.id);
      });

      return {
        ...u,
        row: brick?.row || null,
        col: brick?.col || null,
      };
    });

  // Helper function to calculate similarity score
  const calculateSimilarity = (searchTerm, targetTerm) => {
    if (!searchTerm || !targetTerm) return 0;

    const search = searchTerm.toLowerCase();
    const target = targetTerm.toLowerCase();

    // Exact match
    if (target.includes(search)) return 1.0;

    // Word-level matching
    const searchWords = search.split(/\s+/).filter(Boolean);
    const targetWords = target.split(/\s+/).filter(Boolean);

    let wordMatches = 0;
    searchWords.forEach((searchWord) => {
      if (targetWords.some((targetWord) => targetWord.includes(searchWord))) {
        wordMatches++;
      }
    });

    return wordMatches / searchWords.length;
  };

  // Helper function to get similarity score for a user
  const getUserSimilarityScore = (user, criteria) => {
    const fName = criteria.firstName?.trim().toLowerCase();
    const lName = criteria.lastName?.trim().toLowerCase();
    const ins = criteria.inscription?.trim().toLowerCase();

    let totalScore = 0;
    let fieldCount = 0;

    if (fName) {
      const firstNameScore = calculateSimilarity(fName, user.firstName || "");
      totalScore += firstNameScore;
      fieldCount++;
    }

    if (lName) {
      const lastNameScore = calculateSimilarity(lName, user.lastName || "");
      totalScore += lastNameScore;
      fieldCount++;
    }

    if (ins) {
      const inscriptionScore = Math.max(
        calculateSimilarity(ins, user.inscription || ""),
        calculateSimilarity(ins, user.inscription2 || "")
      );
      totalScore += inscriptionScore;
      fieldCount++;
    }

    return fieldCount > 0 ? totalScore / fieldCount : 0;
  };

  // --- Common Search Function ---
  const performSearch = (criteria) => {
    let filtered = [];

    const fName = criteria.firstName?.trim().toLowerCase();
    const lName = criteria.lastName?.trim().toLowerCase();
    const ins = criteria.inscription?.trim().toLowerCase();

    const filledFields = [fName, lName, ins].filter(Boolean).length;

    // === Form search (LegacySearchForm) ===
    if (filledFields > 0) {
      // Exact matches first
      const exactMatches = users.filter((u) => {
        const userFName = u.firstName?.trim().toLowerCase() || "";
        const userLName = u.lastName?.trim().toLowerCase() || "";
        const userIns1 = u.inscription?.trim().toLowerCase() || "";
        const userIns2 = u.inscription2?.trim().toLowerCase() || "";

        const firstNameMatch = fName ? userFName === fName : true;
        const lastNameMatch = lName ? userLName === lName : true;
        const inscriptionMatch = ins
          ? userIns1.includes(ins) || userIns2.includes(ins)
          : true;

        return firstNameMatch && lastNameMatch && inscriptionMatch;
      });

      if (exactMatches.length > 0) {
        filtered = exactMatches;
        setIsSimilarResults(false);
      } else {
        // No exact matches → similarity search with per-field exact prioritization
        const fName = criteria.firstName?.trim().toLowerCase();
        const lName = criteria.lastName?.trim().toLowerCase();
        const ins = criteria.inscription?.trim().toLowerCase();

        const ranked = users
          .map((user) => {
            const userFName = user.firstName?.trim().toLowerCase() || "";
            const userLName = user.lastName?.trim().toLowerCase() || "";
            const userIns1 = user.inscription?.trim().toLowerCase() || "";
            const userIns2 = user.inscription2?.trim().toLowerCase() || "";

            const exactFirst = fName ? userFName === fName : false;
            const exactLast = lName ? userLName === lName : false;
            const exactIns = ins ? userIns1 === ins || userIns2 === ins : false;

            const exactCount = [exactFirst, exactLast, exactIns].filter(
              Boolean
            ).length;

            return {
              user,
              exactCount,
              similarityScore: getUserSimilarityScore(user, criteria),
            };
          })
          // keep anything that has some similarity or any exact field match
          .filter((r) => r.similarityScore > 0.0 || r.exactCount > 0)
          .sort((a, b) => {
            // 1) prioritize users with more exact field matches
            if (b.exactCount !== a.exactCount)
              return b.exactCount - a.exactCount;
            // 2) then by similarity score
            if (b.similarityScore !== a.similarityScore)
              return b.similarityScore - a.similarityScore;
            // 3) stable fallback: by last name, then first name
            const aName = `${a.user.lastName || ""} ${a.user.firstName || ""}`
              .trim()
              .toLowerCase();
            const bName = `${b.user.lastName || ""} ${b.user.firstName || ""}`
              .trim()
              .toLowerCase();
            return aName.localeCompare(bName);
          })
          .slice(0, 20)
          .map((r) => r.user);

        filtered = ranked;
        setIsSimilarResults(true);
      }

      // Set search context
      if (filledFields === 1) {
        if (fName)
          setSearchContext({ value: criteria.firstName, filter: "FIRSTNAME" });
        else if (lName)
          setSearchContext({ value: criteria.lastName, filter: "LASTNAME" });
        else if (ins)
          setSearchContext({
            value: criteria.inscription,
            filter: "INSCRIPTION",
          });
      } else {
        setSearchContext({ value: "", filter: "" });
      }
    }

    // === Header search (BrickPlacementHeader) ===
    if (criteria.filter && criteria.value) {
      const term = criteria.value.trim().toLowerCase();
      setSearchContext({ value: criteria.value, filter: criteria.filter });

      let exactMatches = [];
      switch (criteria.filter) {
        case "FIRSTNAME":
          exactMatches = users.filter(
            (u) => u.firstName?.trim().toLowerCase() === term
          );
          break;
        case "LASTNAME":
          exactMatches = users.filter(
            (u) => u.lastName?.trim().toLowerCase() === term
          );
          break;
        case "INSCRIPTION":
          exactMatches = users.filter(
            (u) =>
              u.inscription?.trim().toLowerCase() === term ||
              u.inscription2?.trim().toLowerCase() === term
          );
          break;
        default:
          exactMatches = [];
      }

      if (exactMatches.length > 0) {
        filtered = exactMatches;
        setIsSimilarResults(false);
      } else {
        // Partial match fallback
        switch (criteria.filter) {
          case "FIRSTNAME":
            filtered = users.filter((u) =>
              u.firstName?.trim().toLowerCase().includes(term)
            );
            break;
          case "LASTNAME":
            filtered = users.filter((u) =>
              u.lastName?.trim().toLowerCase().includes(term)
            );
            break;
          case "INSCRIPTION":
            filtered = users.filter(
              (u) =>
                u.inscription?.trim().toLowerCase().includes(term) ||
                u.inscription2?.trim().toLowerCase().includes(term)
            );
            break;
          default:
            filtered = [];
        }
        setIsSimilarResults(true);
      }
    }

    // Map results and update UI
    const mapped = mapWithBricks(filtered);
    setResults(mapped);
    setShowGrid(true);
    setSelectedBrick(null); // Reset selection when new search is performed
  };

  // Handle donor click from results table
  const handleDonorClick = (donor) => {
    if (donor.row && donor.col) {
      setSelectedBrick(donor);
    }
  };

  // --- Render ---
  return (
    <Layout>
      {!showGrid ? (
        <LegacySearchForm onSubmit={performSearch} />
      ) : (
        <div className="max-w-7xl mx-auto md:p-8 p-4 ">
          <div className="rounded-3xl overflow-hidden bg-white">
            <BrickPlacementHeader
              onSearch={(value, filter) => performSearch({ value, filter })}
              onFilterChange={(f) => console.log("Filter changed:", f)}
              searchContext={searchContext}
              handleGoBack={() => setShowGrid(false)}
            />
            <BrickGrid bricks={results} selectedBrick={selectedBrick} />
            <ResultsTable
              results={results}
              onDonorClick={handleDonorClick}
              isSimilarResults={isSimilarResults}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
