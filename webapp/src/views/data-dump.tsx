import React from 'react';

export function DataDump(props: any) {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
}
