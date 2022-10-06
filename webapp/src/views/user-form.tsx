import React, { useState } from 'react';

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
    <div>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={handleClickSubmit}>{props.buttonLabel}</button>
    </div>
  );
}
