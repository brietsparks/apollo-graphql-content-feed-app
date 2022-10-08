import React, { useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';

export interface TagFormProps {
  name?: string;
  submit: (data: TagFormData) => void;
  pending?: boolean;
  buttonLabel: string;
}

export interface TagFormData {
  name: string;
}

export function TagForm(props: TagFormProps) {
  const [name, setName] = useState(props.name || '');

  const canSubmit = !props.pending && name?.trim();

  const handleClickSubmit = () => {
    if (canSubmit) {
      props.submit?.({
        name: name?.trim()
      });
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <Button
        onClick={handleClickSubmit}
        disabled={!canSubmit}
      >{props.buttonLabel}</Button>
    </Stack>
  );
}
