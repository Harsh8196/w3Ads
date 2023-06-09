import { CREATOR_VIDEO_CATEGORIES } from '../data/categories'

const getCategoryName = (tag: string) => {
  if (!tag) {
    return null
  }
  return CREATOR_VIDEO_CATEGORIES.find((c) => c.tag === tag)?.name
}
export default getCategoryName
