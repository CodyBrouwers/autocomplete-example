import fs from "fs";
import path from "path";
import util from "util";
import Fuse from "fuse.js";
import { NextApiRequest, NextApiResponse } from "next";

const readFile = util.promisify(fs.readFile);

// == Types ================================================================

export interface IAutocompleteResponse {
  count: number;
  results: string[];
}

type TWordListMap = Fuse<string>;

// == Constants ============================================================

let wordsListCache: TWordListMap | null = null;

// == Functions ============================================================

async function loadWordsList() {
  if (wordsListCache) return wordsListCache;

  const wordsListString = await readFile(path.join(process.cwd(), "/public/words.txt"));
  const wordsList = wordsListString.toString().split("\n");
  wordsListCache = new Fuse(wordsList, { includeScore: true, minMatchCharLength: 2 });
  return wordsListCache;
}

// == Request ==============================================================

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const wordsMap = await loadWordsList();
    if (!wordsMap) return res.status(500).json({ error: "Could not load words list" });
    if (!req.query.q) return res.status(400).json({ error: "Missing query" });

    const query = req.query.q as string;

    const results = wordsMap.search(query, { limit: 10 });
    return res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};
