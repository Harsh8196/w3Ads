import Alert from '@components/Common/Alert'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import type {
  ApprovedAllowanceAmount,
  Profile,
  Publication,
  RecipientDataOutput
} from 'lens'
import {
  CollectModules,
  useAllProfilesQuery,
  useApprovedModuleAllowanceAmountQuery,
  usePublicationRevenueQuery
} from 'lens'
import Link from 'next/link'
import type { Dispatch, FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { LenstubeCollectModule } from 'utils'
import { Analytics, TRACK } from 'utils'
import formatNumber from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import { shortenAddress } from 'utils/functions/shortenAddress'
import { useBalance } from 'wagmi'

import BalanceAlert from './BalanceAlert'
import PermissionAlert from './PermissionAlert'

type Props = {
  showModal: boolean
  setShowModal: Dispatch<boolean>
  video: Publication
  collecting: boolean
  fetchingCollectModule: boolean
  collectModule: LenstubeCollectModule
  collectNow: () => void
}

const CollectModal: FC<Props> = ({
  showModal,
  setShowModal,
  video,
  collectNow,
  collecting,
  collectModule,
  fetchingCollectModule
}) => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )

  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)
  const isMembershipActive =
    video.profile?.followModule?.__typename === 'FeeFollowModuleSettings'
  const isFreeCollect =
    video.collectModule.__typename === 'FreeCollectModuleSettings'

  useEffect(() => {
    Analytics.track(TRACK.OPEN_COLLECT)
  }, [])

  const isRecipientAvailable =
    collectModule?.recipients?.length || collectModule?.recipient

  const { data: recipientProfilesData } = useAllProfilesQuery({
    variables: {
      request: {
        ownedBy: collectModule?.recipients?.length
          ? collectModule?.recipients?.map((r) => r.recipient)
          : collectModule?.recipient
      }
    },
    skip: !isRecipientAvailable
  })

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: selectedChannel?.ownedBy,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: Boolean(collectModule?.amount),
    enabled: Boolean(collectModule?.amount)
  })

  const { data: revenueData } = usePublicationRevenueQuery({
    variables: {
      request: {
        publicationId: video?.id
      }
    },
    skip: !video?.id
  })

  const {
    loading: allowanceLoading,
    data: allowanceData,
    refetch: refetchAllowance
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: [collectModule?.type],
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !selectedChannelId,
    onCompleted: (data) => {
      setIsAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00')
    }
  })

  useEffect(() => {
    if (
      balanceData &&
      collectModule?.amount &&
      parseFloat(balanceData?.formatted) <
        parseFloat(collectModule?.amount?.value)
    ) {
      setHaveEnoughBalance(false)
    } else {
      setHaveEnoughBalance(true)
    }
    if (collectModule?.amount?.asset?.address && selectedChannelId) {
      refetchAllowance()
    }
  }, [
    balanceData,
    collectModule,
    collectModule?.amount?.value,
    collectModule?.amount,
    refetchAllowance,
    selectedChannelId
  ])

  const getDefaultProfileByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items
    if (profiles) {
      // profile.isDefault check not required
      return profiles.filter((p) => p.ownedBy === address)[0]
    }
  }

  const getProfilesByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items
    if (profiles) {
      const handles = profiles
        .filter((p) => p.ownedBy === address)
        .map((p) => p.handle)
      return handles as string[]
    }
    return []
  }

  const renderRecipients = (recipients: RecipientDataOutput[]) => {
    return recipients.map((splitRecipient) => {
      const defaultProfile = getDefaultProfileByAddress(
        splitRecipient.recipient
      ) as Profile
      const pfp = imageCdn(
        defaultProfile
          ? getProfilePicture(defaultProfile)
          : getRandomProfilePicture(splitRecipient.recipient),
        'avatar'
      )
      const label =
        defaultProfile?.handle ?? shortenAddress(splitRecipient?.recipient)
      const hasManyProfiles =
        getProfilesByAddress(splitRecipient.recipient)?.length > 1
      const handles = getProfilesByAddress(splitRecipient.recipient)

      return (
        <div
          key={splitRecipient.recipient}
          className="flex items-center justify-between py-1 text-sm"
        >
          <div className="flex items-center space-x-2">
            <img className="h-4 w-4 rounded-full" src={pfp} alt="pfp" />
            <Tooltip
              placement="bottom-start"
              visible={hasManyProfiles}
              content={handles?.map((handle) => (
                <p key={handle}>{handle}</p>
              ))}
            >
              {defaultProfile?.handle ? (
                <Link href={`/channel/${defaultProfile.handle}`}>{label}</Link>
              ) : (
                <AddressExplorerLink address={splitRecipient?.recipient}>
                  <span>{label}</span>
                </AddressExplorerLink>
              )}
            </Tooltip>
          </div>
          <span>{splitRecipient?.split}%</span>
        </div>
      )
    })
  }

  return (
    <Modal
      title={t`Collect Video`}
      panelClassName="max-w-md"
      onClose={() => setShowModal(false)}
      show={showModal}
    >
      <div className="mt-4">
        {!fetchingCollectModule && !allowanceLoading ? (
          <>
            <div className="mb-3 flex flex-col">
              <span className="text-sm font-semibold">
                <Trans>Total Collects</Trans>
              </span>
              <span className="space-x-1">
                <span className="text-lg">
                  {formatNumber(video?.stats.totalAmountOfCollects)}
                  {collectModule?.collectLimit && (
                    <span> / {collectModule?.collectLimit}</span>
                  )}
                </span>
              </span>
            </div>
            {collectModule?.amount ? (
              <div className="mb-3 flex flex-col">
                <span className="text-sm font-semibold">
                  <Trans>Price</Trans>
                </span>
                <span className="space-x-1">
                  <span className="text-2xl font-semibold">
                    {collectModule?.amount?.value}
                  </span>
                  <span>{collectModule?.amount?.asset.symbol}</span>
                </span>
              </div>
            ) : null}
            {collectModule?.endTimestamp ||
            collectModule?.optionalEndTimestamp ? (
              <div className="mb-3 flex flex-col">
                <span className="mb-0.5 text-sm font-semibold">
                  <Trans>Ends At</Trans>
                </span>
                {collectModule.endTimestamp && (
                  <span className="text-lg">
                    {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')}{' '}
                    at {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                  </span>
                )}
                {collectModule.optionalEndTimestamp && (
                  <span className="text-lg">
                    {dayjs(collectModule.optionalEndTimestamp).format(
                      'MMMM DD, YYYY'
                    )}{' '}
                    at{' '}
                    {dayjs(collectModule.optionalEndTimestamp).format(
                      'hh:mm a'
                    )}
                  </span>
                )}
              </div>
            ) : null}
            {revenueData?.publicationRevenue ? (
              <div className="mb-3 flex flex-col">
                <span className="text-sm font-semibold">
                  <Trans>Revenue</Trans>
                </span>
                <span className="space-x-1">
                  <span className="text-2xl font-semibold">
                    {revenueData?.publicationRevenue?.revenue?.total?.value ??
                      0}
                  </span>
                  <span>{collectModule?.amount?.asset.symbol}</span>
                </span>
              </div>
            ) : null}
            {collectModule?.referralFee ? (
              <div className="mb-3 flex flex-col">
                <span className="mb-0.5 text-sm font-semibold">
                  <Trans>Referral Fee</Trans>
                </span>
                <span className="text-lg">{collectModule.referralFee} %</span>
              </div>
            ) : null}
            {isRecipientAvailable ? (
              <div className="mb-3 flex flex-col">
                <span className="mb-0.5 text-sm font-semibold">
                  <Trans>Revenue</Trans>
                  {collectModule.recipients?.length
                    ? t` Recipients`
                    : t` Recipient`}
                </span>
                {collectModule.recipient &&
                  renderRecipients([
                    { recipient: collectModule.recipient, split: 100 }
                  ])}
                {collectModule.type ===
                  CollectModules.MultirecipientFeeCollectModule &&
                collectModule.recipients?.length
                  ? renderRecipients(collectModule.recipients)
                  : null}
              </div>
            ) : null}
            <div className="flex justify-end space-x-2">
              {isAllowed ? (
                collectModule?.followerOnly && !video.profile.isFollowedByMe ? (
                  <div className="flex-1">
                    <Alert variant="warning">
                      <div className="flex px-2">
                        <Trans>Only</Trans>{' '}
                        {isMembershipActive ? t`Members` : t`Subscribers`}{' '}
                        <Trans>can collect this publication</Trans>
                      </div>
                    </Alert>
                  </div>
                ) : balanceLoading && !haveEnoughBalance ? (
                  <div className="flex w-full justify-center py-2">
                    <Loader />
                  </div>
                ) : haveEnoughBalance ? (
                  <Button disabled={collecting} onClick={() => collectNow()}>
                    {isFreeCollect ? t`Collect for free` : t`Collect Now`}
                  </Button>
                ) : (
                  <BalanceAlert collectModule={collectModule} />
                )
              ) : (
                <PermissionAlert
                  isAllowed={isAllowed}
                  setIsAllowed={setIsAllowed}
                  allowanceModule={
                    allowanceData
                      ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmount
                  }
                />
              )}
            </div>
          </>
        ) : (
          <div className="py-6">
            <Loader />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CollectModal
