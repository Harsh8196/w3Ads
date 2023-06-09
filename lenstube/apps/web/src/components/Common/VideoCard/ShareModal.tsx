import Modal from '@components/UIElements/Modal'
import { t } from '@lingui/macro'
import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { Analytics, LENSTUBE_WEBSITE_URL, STATIC_ASSETS, TRACK } from 'utils'
import { getSharableLink } from 'utils/functions/getSharableLink'
import imageCdn from 'utils/functions/imageCdn'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'

import EmbedVideo from '../EmbedVideo'
import CopyOutline from '../Icons/CopyOutline'
import MirrorOutline from '../Icons/MirrorOutline'
import MirrorVideo from '../MirrorVideo'

type Props = {
  video: Publication
  show: boolean
  setShowShare: React.Dispatch<boolean>
}

const ShareModal: FC<Props> = ({ show, setShowShare, video }) => {
  const [copy] = useCopyToClipboard()

  const onCopyVideoUrl = async () => {
    await copy(`${LENSTUBE_WEBSITE_URL}/watch/${video.id}`)
    toast.success(t`Permalink copied to clipboard`)
    Analytics.track(TRACK.PUBLICATION.PERMALINK)
  }

  return (
    <Modal
      title="Share"
      onClose={() => setShowShare(false)}
      show={show}
      panelClassName="max-w-md"
    >
      <div className="mt-2">
        <div className="no-scrollbar mb-4 flex flex-nowrap items-center space-x-3 overflow-x-auto">
          <EmbedVideo videoId={video.id} onClose={() => setShowShare(false)} />
          <MirrorVideo
            video={video}
            onMirrorSuccess={() => setShowShare(false)}
          >
            <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
              <MirrorOutline className="h-5 w-5" />
            </div>
          </MirrorVideo>
          <Link
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.LENSTER)}
            href={getSharableLink('lenster', video)}
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/lenster-logo.svg`,
                'avatar_lg'
              )}
              className="h-10 w-10 max-w-none rounded-full"
              loading="eager"
              alt="lenster"
              draggable={false}
            />
          </Link>
          <span className="middot" />
          <Link
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            href={getSharableLink('twitter', video)}
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.TWITTER)}
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/twitter-logo.png`,
                'avatar_lg'
              )}
              loading="eager"
              className="h-10 w-10 max-w-none rounded-full"
              alt="twitter"
              draggable={false}
            />
          </Link>
          <Link
            href={getSharableLink('reddit', video)}
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.REDDIT)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/reddit-logo.webp`,
                'avatar_lg'
              )}
              className="h-10 w-10 max-w-none rounded-full"
              loading="eager"
              alt="reddit"
              draggable={false}
            />
          </Link>
          <Link
            href={getSharableLink('linkedin', video)}
            target="_blank"
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.LINKEDIN)}
            rel="noreferrer"
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/linkedin-logo.png`,
                'avatar_lg'
              )}
              loading="eager"
              alt="linkedin"
              className="h-10 w-10 max-w-none rounded-full"
              draggable={false}
            />
          </Link>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800">
          <div className="select-all truncate text-sm">
            {LENSTUBE_WEBSITE_URL}/watch/{video.id}
          </div>
          <button
            className="ml-2 hover:opacity-60 focus:outline-none"
            onClick={() => onCopyVideoUrl()}
            type="button"
          >
            <CopyOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal
