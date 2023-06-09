import { expect, test } from '@playwright/test'
import formatNumber from 'utils/functions/formatNumber'

test('formatNumber', () => {
  expect(formatNumber(-100)).toBe(100)
  expect(formatNumber(1000)).toBe('1.00k')
  expect(formatNumber(1500)).toBe('1.50k')
  expect(formatNumber(1100000)).toBe('1.10m')
})
