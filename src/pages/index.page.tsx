import { useState } from "react";
import { Page, Grid, AutoComplete } from "@geist-ui/react";
import { useDebounceFunction, useToggle } from "@hooks";
import { IAutocompleteResponse } from "./api/autocomplete.api";

// == Types ================================================================

interface IAutoCompleteOption {
  value: string;
  label: string;
}

// == Constants ============================================================

const DEBOUNCE_DURATION = 500;
const AUTOCOMPLETE_ENDPOINT = "/api/autocomplete";

// == Functions ============================================================

// == Component ============================================================

export default function Home() {
  const [isLoading, toggleIsLoading] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<IAutoCompleteOption[]>([]);

  const getSearchResults = useDebounceFunction(async (debouncedSearchQuery: string) => {
    setSearchQuery(debouncedSearchQuery);
    if (!debouncedSearchQuery) return;

    toggleIsLoading(true);
    const params = new URLSearchParams({ q: debouncedSearchQuery });
    const endpoint = `${AUTOCOMPLETE_ENDPOINT}?${params.toString()}`;
    const response = await fetch(endpoint, { method: "GET" });
    if (response.ok) {
      const { results } = (await response.json()) as IAutocompleteResponse;

      const formattedResults = results.map((result) => ({ value: result, label: result }));
      setSearchResults(formattedResults);
    }
    toggleIsLoading(false);
  }, DEBOUNCE_DURATION);

  const onSearch = (value: string) => {
    if (searchQuery === value) return;

    getSearchResults(value);
  };

  const onSelect = (value: string) => {
    console.log(value);
  };

  return (
    <Page>
      <Grid.Container alignItems="center" height="100vh" justify="center">
        <AutoComplete
          clearable
          options={searchResults}
          searching={isLoading}
          onSearch={onSearch}
          onSelect={onSelect}
        />
      </Grid.Container>
    </Page>
  );
}

// == Styles ===============================================================
