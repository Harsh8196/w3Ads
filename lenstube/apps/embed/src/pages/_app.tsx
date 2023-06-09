import '../styles/index.css'

import { LivepeerConfig } from '@livepeer/react'
import mixpanel from 'mixpanel-browser'
import type { AppProps } from 'next/app'
import React from 'react'
import { IS_PRODUCTION, MIXPANEL_API_HOST, MIXPANEL_TOKEN } from 'utils'
import bloomer from 'utils/font'
import { getLivepeerClient, videoPlayerTheme } from 'utils/functions/livepeer'

function MyApp({ Component, pageProps }: AppProps) {
  if (IS_PRODUCTION) {
    mixpanel.init(MIXPANEL_TOKEN, {
      api_host: MIXPANEL_API_HOST,
      cross_subdomain_cookie: true
    })
  }
  return (
    <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
      <style jsx global>{`
        body {
          font-family: ${bloomer.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </LivepeerConfig>
  )
}

export default MyApp
