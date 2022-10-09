import React from 'react';
import { Autocomplete, CircularProgress, TextField, TextFieldProps } from '@mui/material';
import debounce from 'lodash/debounce';

export type SearchBarImplProps<T> = Omit<
  SearchBarProps<T>,
  | 'getSuggestionKey'
  | 'getSuggestionLabel'
>;

export interface SearchBarProps<T> {
  label?: string;
  loading: boolean;
  suggestions: T[];
  getSuggestionKey: (s: T) => string;
  getSuggestionLabel: (s: T) => string;
  onChange?: (value?: T) => void;
  onInputChange: (term: string) => void;
}

export function SearchBar<T>(props: SearchBarProps<T>) {
  const handleChange = (e: unknown, value: T | null) => {
    props.onChange?.(value || undefined);
  };

  const handleInputChange = debounce((e: unknown, term: string) => {
    props.onInputChange(term.trim());
  }, 500);

  const options = props.suggestions.map((suggestion) => ({
    key: props.getSuggestionKey(suggestion),
    ...suggestion
  }));

  return (
    <Autocomplete
      loading={props.loading}
      onChange={handleChange}
      onInputChange={handleInputChange}
      getOptionLabel={props.getSuggestionLabel}
      options={options}
      renderInput={(inputProps) => (
        <SearchInput
          {...inputProps}
          label={props.label}
          loading={props.loading}
        />
      )}
    />
  );
}

type SearchInputProps =
  TextFieldProps & {
  loading: boolean;
}

function SearchInput({ loading, ...props }: SearchInputProps) {
  return (
    <TextField
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <React.Fragment>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {props.InputProps?.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  );
}
