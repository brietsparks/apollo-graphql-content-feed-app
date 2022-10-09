import React, { ComponentType } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface PostFormProps {
  tagsFormComponent: ComponentType<{ onChange: TagsChangeHandler }>;
  submit: (data: PostFormData) => void | Promise<unknown>;
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

  const handleSubmit = form.handleSubmit((data, e) => {
    e?.preventDefault();
    const promise = props.submit(data);
    if (promise) {
      promise.then(() => form.reset());
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          {...form.register('title')}
        />

        <TagsForm onChange={handleTagChange}/>

        <TextField
          label="Body"
          {...form.register('body')}
        />

        <Button type="submit">{props.buttonLabel}</Button>
      </Stack>
    </form>
  );
}
