import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'
import { STATIC_ASSETS } from 'utils'
import getLensHandle from 'utils/functions/getLensHandle'

import type { MentionProps } from './utils'

const ChannelLink = ({ ...props }: any) => {
  return (
    <Link
      href={`/channel/${getLensHandle(props.display?.slice(1))}`}
      className="inline-flex items-center space-x-1 rounded-full bg-gray-200 px-2 text-sm font-medium dark:bg-gray-800"
    >
      <img
        src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
        className="h-3 w-3"
        draggable={false}
        alt="lenstube"
      />
      <span>{props.display.replace('@', '')}</span>
    </Link>
  )
}

export class MentionMatcher extends Matcher<MentionProps> {
  replaceWith(match: string, props: MentionProps) {
    return React.createElement(ChannelLink, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /@[a-zA-Z0-9-_.]+(\.lens|\.test)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
