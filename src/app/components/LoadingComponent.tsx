'use client';

import { GridLoader } from 'react-spinners';

export default function LoadingComponent({ color }: { color: string }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <GridLoader color={color} size={30} />
    </div>
  );
}
