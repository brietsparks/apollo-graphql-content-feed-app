import React, { ComponentType } from 'react';
import { Button, Stack, TextField } from '@mui/material';

import { usePostFormModel, SubmitPostForm, PostFormSuccessHandler, PostFormTag, PostFormTagsChangeHandler } from './post-form-model';

export interface PostFormProps {
  submit: SubmitPostForm;
  onSuccess?: PostFormSuccessHandler;
  tagsComponent: ComponentType<PostFormTagsComponentProps>;
  submitButtonLabel: string;
  pending: boolean;
}

export interface PostFormTagsComponentProps {
  value?: PostFormTag[];
  onChange?: PostFormTagsChangeHandler;
}

export function PostForm(props: PostFormProps) {
  const { tagsComponent: TagsForm } = props;

  const form = usePostFormModel({
    submit: props.submit,
    onSuccess: props.onSuccess,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          {...form.register('title')}
          helperText={form.formState.errors.title?.message}
          error={!!form.formState.errors.title?.message}
        />

        <TagsForm
          value={form.tags}
          onChange={form.handleChangeTags}
        />

        <TextField
          label="Body"
          {...form.register('body')}
        />

        <Button type="submit">{props.submitButtonLabel}</Button>
      </Stack>
    </form>
  );
}
