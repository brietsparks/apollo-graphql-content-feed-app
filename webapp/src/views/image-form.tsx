import React, { ComponentType, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface ImageFormProps {
  tagsComponent: ComponentType<ImageFormTagsComponentProps>;
  submit: (data: ImageFormData) => void | Promise<unknown>;
  buttonLabel: string;
  pending: boolean;
}

export interface ImageFormTagsComponentProps {
  value?: ImageFormTag[];
  onChange?: ImageFormTagsChangeHandler;
}
export type ImageFormTagsChangeHandler = (tags: ImageFormTag[]) => void;
export type ImageFormTag = { id: string };

export interface ImageFormData {
  tagIds?: string[];
  url: string;
  caption?: string;
}

export function ImageForm(props: ImageFormProps) {
  const { tagsComponent: TagsForm } = props;

  const form = useForm<ImageFormData>({
    resolver: yupResolver(validationSchema())
  });
  const [tags, setTags] = useState<ImageFormTag[]>([]);

  const reset = () => {
    form.reset();
    setTags([]);
  };

  const handleSubmit = form.handleSubmit((data, e) => {
    e?.preventDefault();
    const promise = props.submit({
      ...data,
      tagIds: tags.map(tag => tag.id)
    });
    if (promise) {
      promise.then(reset);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="URL"
          {...form.register('url')}
          helperText={form.formState.errors.url?.message}
          error={!!form.formState.errors.url?.message}
        />

        <TagsForm
          value={tags}
          onChange={setTags}
        />

        <TextField
          label="Caption"
          {...form.register('caption')}
        />

        <Button type="submit">{props.buttonLabel}</Button>
      </Stack>
    </form>
  );
}

const validationSchema = () => yup.object({
  url: yup.string().label('URL').required(),
  caption: yup.string().label('Caption'),
}).required();
