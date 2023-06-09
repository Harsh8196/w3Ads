import CollectVideo from '@components/Watch/CollectVideo'
import { t } from '@lingui/macro'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { Analytics, TRACK } from 'utils'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: Publication
  currentViewingId: string
  intersectionCallback: (id: string) => void
}

const ByteVideo: FC<Props> = ({
  video,
  currentViewingId,
  intersectionCallback
}) => {
  const videoRef = useRef<HTMLMediaElement>()
  const intersectionRef = useRef<HTMLDivElement>(null)
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video, true)),
    'thumbnail_v'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, true)

  const playVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.currentTime = 0
    videoRef.current.volume = 1
    videoRef.current.autoplay = true
    videoRef.current?.play().catch(() => {})
    Analytics.track(TRACK.PLAY_BYTE_VIDEO)
  }

  const observer = new IntersectionObserver((data) => {
    if (data[0].target.id && data[0].isIntersecting) {
      intersectionCallback(data[0].target.id)
      const nextUrl = `${location.origin}/bytes/${video?.id}`
      history.replaceState({ path: nextUrl }, '', nextUrl)
    }
  })

  useEffect(() => {
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pauseVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.volume = 0
    videoRef.current?.pause()
    videoRef.current.autoplay = false
  }

  const onClickVideo = () => {
    if (videoRef.current?.paused) {
      playVideo()
    } else {
      pauseVideo()
    }
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return
    }
    videoRef.current = ref
    playVideo()
  }

  if (!video) {
    return null
  }

  return (
    <div
      className="flex snap-center justify-center md:mt-6"
      data-testid="byte-video"
    >
      <div className="relative">
        <div
          className="ultrawide:w-[650px] flex h-screen w-screen min-w-[250px] items-center overflow-hidden bg-black md:h-[calc(100vh-145px)] md:w-[400px] md:rounded-xl"
          style={{
            backgroundColor: backgroundColor ? backgroundColor : undefined
          }}
        >
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={video?.id}
          />
          {currentViewingId === video.id ? (
            <VideoPlayer
              refCallback={refCallback}
              permanentUrl={getPublicationMediaUrl(video)}
              posterUrl={thumbnailUrl}
              ratio="9to16"
              publicationId={video.id}
              showControls={false}
              creator=''
              options={{
                autoPlay: false,
                muted: false,
                loop: true,
                loadingSpinner: false,
                isCurrentlyShown: currentViewingId === video.id
              }}
            />
          ) : (
            <div className="h-full w-full">
              <img
                className="w-full object-cover"
                src={thumbnailUrl}
                alt="thumbnail"
                draggable={false}
              />
              <span className="invisible absolute">
                <VideoPlayer
                  permanentUrl={getPublicationMediaUrl(video)}
                  showControls={false}
                  creator=''
                  options={{
                    autoPlay: false,
                    muted: true,
                    loadingSpinner: false,
                    isCurrentlyShown: currentViewingId === video.id
                  }}
                />
              </span>
            </div>
          )}
        </div>
        <TopOverlay onClickVideo={onClickVideo} />
        <BottomOverlay video={video} />
        <div className="absolute bottom-[15%] right-2 z-[1] md:hidden">
          <ByteActions video={video} />
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
            <div className="text-center text-white md:text-gray-500">
              <CollectVideo video={video} />
              <div className="text-xs">
                {video.stats?.totalAmountOfCollects || t`Collect`}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:flex">
        <ByteActions video={video} />
      </div>
    </div>
  )
}

export default React.memo(ByteVideo)
