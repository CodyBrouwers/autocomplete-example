import fs from "fs";
import path from "path";
import util from "util";
import { NextApiRequest, NextApiResponse } from "next";

const readFile = util.promisify(fs.readFile);

// == Types ================================================================

export interface IAutocompleteResponse {
  count: number;
  results: string[];
}

type TWordListMap = Record<string, string[]>;

// == Constants ============================================================

let wordsListCache: TWordListMap | null = null;

// == Functions ============================================================

async function loadWordsList() {
  if (wordsListCache) return wordsListCache;

  const wordsList = await readFile(path.join(process.cwd(), "/public/words.txt"));
  wordsListCache = wordsList
    .toString()
    .split("\n")
    .reduce<TWordListMap>((map, word) => {
      map[word[0]] ||= [];
      map[word[0]].push(word);
      return map;
    }, {});
  return wordsListCache;
}

function fuzzyMatch(query: string, word: string) {
  const pattern = `^${query.split("").join(".*")}$`;
  const regex = new RegExp(pattern);
  return regex.test(word);
}

// == Request ==============================================================

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const wordsMap = await loadWordsList();
    if (!wordsMap) return res.status(500).json({ error: "Could not load words list" });
    if (!req.query.q) return res.status(400).json({ error: "Missing query" });

    const query = req.query.q as string;
    const results = [];
    const wordsList = wordsMap[query[0]] || [];
    for (let i = 0; i < wordsList.length; i += 1) {
      if (wordsList[i].startsWith(query) || fuzzyMatch(query, wordsList[i])) {
        results.push(wordsList[i]);
      }
      if (results.length === 10) break;
    }
    return res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};
