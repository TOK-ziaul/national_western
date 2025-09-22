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

    // Case 1: Called from LegacySearchForm
    if (criteria.firstName || criteria.lastName || criteria.inscription) {
      const fName = criteria.firstName?.trim().toLowerCase();
      const lName = criteria.lastName?.trim().toLowerCase();
      const ins = criteria.inscription?.trim().toLowerCase();

      // Count how many fields are filled
      const filledFields = [fName, lName, ins].filter(Boolean).length;

      if (filledFields === 1) {
        // Single field search - use OR logic
        filtered = users.filter(
          (u) =>
            (fName && u.firstName?.toLowerCase().includes(fName)) ||
            (lName && u.lastName?.toLowerCase().includes(lName)) ||
            (ins &&
              (u.inscription?.toLowerCase().includes(ins) ||
                u.inscription2?.toLowerCase().includes(ins)))
        );
        setIsSimilarResults(false);
      } else {
        // Multiple fields search - try exact match first, then similarity
        const exactMatches = users.filter((u) => {
          const matches = [];

          if (fName) {
            matches.push(u.firstName?.toLowerCase().includes(fName));
          }
          if (lName) {
            matches.push(u.lastName?.toLowerCase().includes(lName));
          }
          if (ins) {
            matches.push(
              u.inscription?.toLowerCase().includes(ins) ||
                u.inscription2?.toLowerCase().includes(ins)
            );
          }

          // All filled fields must match (AND logic)
          return matches.every(Boolean);
        });

        if (exactMatches.length > 0) {
          // Use exact matches if found
          filtered = exactMatches;
          setIsSimilarResults(false);
        } else {
          // No exact matches - find similar results
          const similarResults = users
            .map((user) => ({
              user,
              similarityScore: getUserSimilarityScore(user, criteria),
            }))
            .filter((result) => result.similarityScore > 0.3) // Minimum 30% similarity
            .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity
            .slice(0, 20) // Limit to top 20 similar results
            .map((result) => result.user);

          filtered = similarResults;
          setIsSimilarResults(true);
        }
      }

      // Set search context based on primary field or combined search
      if (filledFields === 1) {
        if (fName) {
          setSearchContext({ value: criteria.firstName, filter: "FIRSTNAME" });
        } else if (lName) {
          setSearchContext({ value: criteria.lastName, filter: "LASTNAME" });
        } else if (ins) {
          setSearchContext({
            value: criteria.inscription,
            filter: "INSCRIPTION",
          });
        }
      } else {
        setSearchContext({
          value: "",
          filter: "",
        });
      }
    }
    // Case 2: Called from BrickPlacementHeader
    if (criteria.filter && criteria.value) {
      const term = criteria.value.trim().toLowerCase();

      // Update search context
      setSearchContext({ value: criteria.value, filter: criteria.filter });

      switch (criteria.filter) {
        case "FIRSTNAME":
          filtered = users.filter((u) =>
            u.firstName?.toLowerCase().includes(term)
          );
          break;
        case "LASTNAME":
          filtered = users.filter((u) =>
            u.lastName?.toLowerCase().includes(term)
          );
          break;
        case "INSCRIPTION":
          filtered = users.filter(
            (u) =>
              u.inscription?.toLowerCase().includes(term) ||
              u.inscription2?.toLowerCase().includes(term)
          );
          break;
        default:
          filtered = [];
      }
    }

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
