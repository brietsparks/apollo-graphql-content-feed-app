import React, { useMemo, useCallback, useState, SyntheticEvent } from 'react';
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
  clearOnChange?: boolean;
  onInputChange: (term: string) => void;
  debounceMs: number;
}

export function SearchBar<T>(props: SearchBarProps<T>) {
  const { onInputChange, debounceMs } = props;

  const [value, setValue] = useState<T | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: unknown, value: T | null) => {
    setValue(null);
    if (props.clearOnChange) {
      setInputValue('');
    }
    if (value) {
      props.onChange?.(value);
    }
  };

  const debouncedOnInputChange = useMemo(() => {
    return debounce((e: unknown, term: string) => {
      onInputChange(term.trim());
    }, debounceMs)
  }, [onInputChange, debounceMs]);

  const handleInputChange = useCallback((e: SyntheticEvent, term: string) => {
    if (e.type === 'change') {
      setInputValue(term);
      debouncedOnInputChange(e, term.trim());
    }
  }, [debouncedOnInputChange]);

  const options = props.suggestions.map((suggestion) => ({
    key: props.getSuggestionKey(suggestion),
    ...suggestion
  }));

  return (
    <Autocomplete
      loading={props.loading}
      onChange={handleChange}
      value={value}
      inputValue={inputValue}
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
