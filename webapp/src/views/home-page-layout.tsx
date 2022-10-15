import React, { ReactNode } from 'react';
import { Stack, Grid } from '@mui/material';

export interface HomePageLayoutProps {
  userCreationForm: ReactNode;
  usersList: ReactNode;
  tagCreationForm: ReactNode;
  tagsList: ReactNode;
  tagSearchBar: ReactNode;
  postCreationForm: ReactNode;
  postsList: ReactNode;
  imageCreationForm: ReactNode;
  imagesList: ReactNode;
}

export function HomePageLayout(props: HomePageLayoutProps) {
  return (
    <Grid container>
      {/*<Grid item>*/}
      {/*  <Stack>*/}
      {/*    {props.userCreationForm}*/}
      {/*    {props.usersList}*/}
      {/*  </Stack>*/}
      {/*</Grid>*/}
      <Grid item>
        <Stack>
          {props.tagCreationForm}
          {props.tagsList}
        </Stack>
      </Grid>

      <Grid item>
        <Stack>
          {props.postCreationForm}
          {props.postsList}
        </Stack>
      </Grid>


      <Grid item>
        <Stack>
          {props.imageCreationForm}
          {props.imagesList}
        </Stack>
      </Grid>
    </Grid>
  )
}
