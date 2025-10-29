import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extiende los matchers de vitest con jest-dom
expect.extend(matchers)

// Limpia después de cada test
afterEach(() => {
  cleanup()
})