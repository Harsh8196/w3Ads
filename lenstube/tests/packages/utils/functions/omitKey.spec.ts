import { expect, test } from '@playwright/test'
import omitKey from 'utils/functions/omitKey'

test('omitKey', async () => {
  const object = { key1: 'value1', key2: 'value2' }
  const key = 'key1'
  const expectedResult = { key2: 'value2' }
  const result = omitKey(object, key)
  expect(result).toEqual(expectedResult)
})
