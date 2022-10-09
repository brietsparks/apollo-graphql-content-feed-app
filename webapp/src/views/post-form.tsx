import React, { ComponentType } from 'react';
import { TextField, Button, Stack, FormControl, InputLabel, Select } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface PostCreationFormProps {
  tagsFormComponent: ComponentType<{ onChange: TagsChangeHandler }>;
  onSubmit: (data: PostCreationFormData) => void;
  pending: boolean;
}

export type TagsChangeHandler = (tags?: ({ id: string })[]) => void;

export interface PostCreationFormData {
  tagIds?: string[];
  name?: string
}

export type Electrode = 'anode' | 'cathode';

export function PostCreationForm(props: PostCreationFormProps) {
  const { tagsFormComponent: TagsForm } = props;

  const form = useForm<PostCreationFormData>();

  const handleTagChange: TagsChangeHandler = (tags) => {
    form.setValue('tagIds', tags?.map(tag => tag.id));
  };

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmit(data);
  });

  return (
    <Stack spacing={2}>
      <TextField
        label="Name"
        {...form.register('name')}
      />

      <TagsForm onChange={handleTagChange} />

      <Button onClick={handleSubmit}>Create Post</Button>
    </Stack>
  );
}
