import React, { createContext, useContext, ReactNode } from 'react';

const defaultUserId = '00000000-0000-0000-0000-000000000000';

const CurrentUserContext = createContext<string|undefined>('');

export interface CurrentUserContextProviderWidgetProps {
  children: ReactNode;
}

export function CurrentUserContextProviderWidget(props: CurrentUserContextProviderWidgetProps) {
  return (
    <CurrentUserContext.Provider value={defaultUserId}>
      {props.children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
