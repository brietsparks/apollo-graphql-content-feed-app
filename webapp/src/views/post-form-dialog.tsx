import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

import { PostFormProps } from './post-form';
import { usePostFormModel } from './post-form-model';

export type PostFormDialogProps =
  PostFormProps & {
  cancelButtonLabel?: string;
  isOpen: boolean;
  close: () => void;
};

export function PostFormDialog(props: PostFormDialogProps) {
  const { tagsComponent: TagsForm, cancelButtonLabel = 'Cancel' } = props;

  const form = usePostFormModel({
    submit: props.submit,
    onSuccess: props.onSuccess,
  });

  const handleClickClose = () => {
    props.close();
  }

  return (
    <Dialog open={props.isOpen} onClose={handleClickClose}>
      <DialogTitle>Create Post</DialogTitle>

      <DialogContent>
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

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.close}>{cancelButtonLabel}</Button>
        <Button onClick={form.handleSubmit} type="submit" color="primary">{props.submitButtonLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
