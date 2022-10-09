import React, { ComponentType } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface PostFormProps {
  tagsFormComponent: ComponentType<{ onChange: TagsChangeHandler }>;
  submit: (data: PostFormData) => void;
  buttonLabel: string;
  pending: boolean;
}

export type TagsChangeHandler = (tags?: ({ id: string })[]) => void;

export interface PostFormData {
  tagIds?: string[];
  title: string
  body?: string;
}

export function PostForm(props: PostFormProps) {
  const { tagsFormComponent: TagsForm } = props;

  const form = useForm<PostFormData>();

  const handleTagChange: TagsChangeHandler = (tags) => {
    form.setValue('tagIds', tags?.map(tag => tag.id));
  };

  const handleSubmit = form.handleSubmit((data) => {
    props.submit(data);
  });

  return (
    <Stack spacing={2}>
      <TextField
        label="Title"
        {...form.register('title')}
      />

      <TagsForm onChange={handleTagChange} />

      <TextField
        label="Body"
        {...form.register('body')}
      />

      <Button onClick={handleSubmit}>{props.buttonLabel}</Button>
    </Stack>
  );
}
