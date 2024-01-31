'use client';
import { Button, Callout, Text, TextField, ThemePanel } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import { useForm,Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/createIssueSchema';
import {z} from 'zod';
import { title } from 'process';
import ErrorMessage from '@/app/component/ErrorMessage';
import Spinner from '../../component/Spinner';

type issueForm=z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
   const router = useRouter();
  const {register,control,handleSubmit,formState:{ errors}} = useForm<issueForm>({
    resolver:zodResolver(createIssueSchema)
  });
  const [error,setError]=useState('');
    const [isSubmitting,setSubmiting]=useState(false);
  return (
    <div className='max-w-xl '>
        {error && (<Callout.Root color="red" className='mb-5'>
            <Callout.Text>{error}</Callout.Text>
            </Callout.Root>)}
    <form className="space-y-3" 
        onSubmit={handleSubmit(async (data) => { 
        try {
            setSubmiting(true);
            await axios.post('/api/issues',data);
            router.push('/issues')
        } catch(error) {
            setSubmiting(false);
            setError('An unexpected error occured')
        }
        })}>
        <TextField.Root>
            <TextField.Input placeholder='Title'{...register('title')}/>
        </TextField.Root>
      <ErrorMessage>
            {errors.title?.message}
        </ErrorMessage>


        <Controller
            name="description"
            control={control}
            render={({field}) => <SimpleMDE placeholder='Description' {...field}/>}
        />
        <ErrorMessage>
            {errors.description?.message}
        </ErrorMessage>

        <Button disabled={isSubmitting}>Submit New Issue {isSubmitting &&  <Spinner />}</Button> 
        
    </form>
    </div>
  )
}

export default NewIssuePage