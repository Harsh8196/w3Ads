import type { Profile } from 'lens'

import { getRandomProfilePicture } from './getRandomProfilePicture'
import imageCdn from './imageCdn'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

const getProfilePicture = (
  channel: Profile,
  type: 'avatar' | 'avatar_lg' | 'thumbnail' = 'avatar'
): string => {
  const url =
    channel.picture && channel.picture.__typename === 'MediaSet'
      ? channel?.picture?.original?.url
      : channel.picture?.__typename === 'NftImage'
      ? channel?.picture?.uri
      : getRandomProfilePicture(channel?.ownedBy)
  const sanitized = sanitizeDStorageUrl(url)
  return imageCdn(sanitized, type)
}

export default getProfilePicture
