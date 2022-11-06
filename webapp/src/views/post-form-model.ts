import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface usePostFormModelProps {
  submit: SubmitPostForm;
  onSuccess?: PostFormSuccessHandler;
}

export type SubmitPostForm = (data: PostFormData) => void | Promise<unknown>

export type PostFormSuccessHandler = (event: PostFormSuccessEvent) => void;

export type PostFormTagsChangeHandler = (tags: PostFormTag[]) => void;

export interface PostFormData {
  tagIds?: string[];
  title: string
  body?: string;
}

export type PostFormTag = { id: string };

export interface PostFormSuccessEvent {
  reset: () => void;
}

export function usePostFormModel(props: usePostFormModelProps) {
  const form = useForm<PostFormData>({
    resolver: yupResolver(validationSchema())
  });
  const [tags, setTags] = useState<PostFormTag[]>([]);

  const reset = () => {
    form.reset();
    setTags([]);
  };

  const handleSuccess = () => {
    props.onSuccess?.({ reset });
  };

  const handleSubmit = form.handleSubmit((data, e) => {
    e?.preventDefault();
    const promise = props.submit({
      ...data,
      tagIds: tags.map(tag => tag.id)
    });
    if (promise) {
      promise.then(handleSuccess);
    }
  });

  const handleChangeTags = (tags: PostFormTag[]) => setTags(tags);

  return {
    ...form,
    handleSubmit,
    tags,
    handleChangeTags,
  };
}

const validationSchema = () => yup.object({
  title: yup.string().label('Title').required(),
  body: yup.string().label('Body'),
}).required();
