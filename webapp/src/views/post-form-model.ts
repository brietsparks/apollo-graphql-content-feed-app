import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const form = useForm<PostFormData>();
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
