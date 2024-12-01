'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, logout } from '@/store/features/authSlice';

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
} 