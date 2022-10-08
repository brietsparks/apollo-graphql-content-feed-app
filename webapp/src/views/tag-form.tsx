import React, { useState } from 'react';

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
    <div>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button
        onClick={handleClickSubmit}
        disabled={!canSubmit}
      >{props.buttonLabel}</button>
    </div>
  );
}
