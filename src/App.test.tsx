import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {AuthProvider} from "./auth/AuthProvider";

test('renders without crashing', () => {
  const { baseElement } = render(<AuthProvider />);
  expect(baseElement).toBeDefined();
});
