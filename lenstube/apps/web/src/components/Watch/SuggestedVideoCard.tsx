import IsVerified from '@components/Common/IsVerified'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import type { Attribute, Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { FALLBACK_COVER_URL, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from 'utils'
import { getRelativeTime, getTimeFromSeconds } from 'utils/functions/formatTime'
import { generateVideoThumbnail } from 'utils/functions/generateVideoThumbnails'
import { getValueFromTraitType } from 'utils/functions/getFromAttributes'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import useAverageColor from 'utils/hooks/useAverageColor'

type Props = {
  video: Publication
}

const SuggestedVideoCard: FC<Props> = ({ video }) => {
  const [showReport, setShowReport] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const thumbnailUrl = isSensitiveContent
    ? `${STATIC_ASSETS}/images/sensor-blur.png`
    : getThumbnailUrl(video)

  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div className="group flex justify-between">
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        video={video}
        show={showReport}
        setShowReport={setShowReport}
      />
      <div className="flex justify-between">
        <div className="flex-none overflow-hidden rounded-lg">
          <Link
            href={`/watch/${video.id}`}
            className="cursor-pointer rounded-lg"
          >
            <div className="relative">
              <img
                className={clsx(
                  'h-20 w-36 bg-gray-300 object-center dark:bg-gray-700',
                  isBytesVideo ? 'object-contain' : 'object-cover'
                )}
                src={
                  thumbnailUrl
                    ? imageCdn(
                        thumbnailUrl,
                        isBytesVideo ? 'thumbnail_v' : 'thumbnail'
                      )
                    : ''
                }
                style={{ backgroundColor: `${backgroundColor}95` }}
                alt="thumbnail"
                draggable={false}
                onError={async ({ currentTarget }) => {
                  currentTarget.src = FALLBACK_COVER_URL
                  const thumbnail = await generateVideoThumbnail(
                    getPublicationMediaUrl(video)
                  )
                  currentTarget.onerror = null
                  if (thumbnail?.includes('base64')) {
                    currentTarget.src = thumbnail
                  }
                }}
              />
              {!isSensitiveContent && videoDuration ? (
                <div>
                  <span className="absolute bottom-1 right-1 rounded bg-black px-1 text-[10px] text-white">
                    {getTimeFromSeconds(videoDuration)}
                  </span>
                </div>
              ) : null}
            </div>
          </Link>
        </div>
        <div className="overflow-hidden px-2.5">
          <div className="flex flex-col items-start pb-1">
            <div className="grid w-full overflow-hidden break-words">
              <Link
                href={`/watch/${video.id}`}
                className="line-clamp-2 text-sm font-medium"
                title={video.metadata?.name ?? ''}
              >
                {video.metadata?.name}
              </Link>
            </div>
            <div className="truncate">
              <Link
                href={`/channel/${video.profile?.handle}`}
                className="truncate text-[13px] opacity-70 hover:opacity-100"
              >
                <div className="flex items-center space-x-0.5">
                  <span>{video?.profile?.handle}</span>
                  <IsVerified id={video?.profile.id} size="xs" />
                </div>
              </Link>
            </div>
            <div className="mt-0.5 flex items-center truncate text-xs opacity-70">
              <span className="whitespace-nowrap">
                {video.stats?.totalUpvotes} <Trans>likes</Trans>
              </span>
              <span className="middot" />
              <span>{getRelativeTime(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      <VideoOptions
        video={video}
        setShowReport={setShowReport}
        setShowShare={setShowShare}
      />
    </div>
  )
}

export default React.memo(SuggestedVideoCard)
