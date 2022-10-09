import React, { ReactNode } from 'react';
import { Stack, Grid } from '@mui/material';

export interface HomePageLayoutProps {
  userCreationForm: ReactNode;
  usersList: ReactNode;
  tagCreationForm: ReactNode;
  tagSearchBar: ReactNode;
  postCreationForm: ReactNode;
}

export function HomePageLayout(props: HomePageLayoutProps) {
  return (
    <Grid container>
      <Grid item>
        <Stack>
          {props.userCreationForm}
          {props.usersList}
        </Stack>
      </Grid>
      <Grid item>
        <Stack>
          {props.tagCreationForm}
          {props.tagSearchBar}
        </Stack>
      </Grid>
      <Grid item>
        <Stack>
          {props.postCreationForm}
        </Stack>
      </Grid>
    </Grid>
  )
}
