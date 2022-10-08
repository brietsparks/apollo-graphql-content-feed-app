import React, { useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';

export interface UserFormProps {
  name?: string;
  submit: (data: UserFormData) => void;
  buttonLabel: string;
}

export interface UserFormData {
  name: string;
}

export function UserForm(props: UserFormProps) {
  const [name, setName] = useState(props.name || '');

  const handleClickSubmit = () => {
    if (name?.trim()) {
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

      <Button onClick={handleClickSubmit}>{props.buttonLabel}</Button>
    </Stack>
  );
}
