import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { utils } from 'ethers'
import type { Erc20 } from 'lens'
import type { Dispatch, FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import type { CollectModuleType, UploadedVideo } from 'utils'
import { WMATIC_TOKEN_ADDRESS } from 'utils'
import { z } from 'zod'

import Splits from './Splits'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
  setShowModal: Dispatch<boolean>
  enabledCurrencies: { enabledModuleCurrencies: Array<Erc20> }
}

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().min(1, { message: t`Invalid amount` }),
  collectLimit: z
    .string()
    .min(1, { message: t`Invalid collect limit` })
    .optional(),
  referralPercent: z
    .number()
    .max(100, { message: t`Percentage should be 0 to 100` })
    .nonnegative({ message: t`Should to greater than or equal to zero` })
})
export type FormData = z.infer<typeof formSchema>

const FeeCollectForm: FC<Props> = ({
  uploadedVideo,
  setCollectType,
  setShowModal,
  enabledCurrencies
}) => {
  const submitContainerRef = useRef<HTMLDivElement>(null)

  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('WMATIC')
  const splitRecipients = uploadedVideo.collectModule.multiRecipients ?? []

  const {
    register,
    formState: { errors },
    handleSubmit,
    unregister,
    setError
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedVideo.collectModule.referralFee || 0),
      currency:
        uploadedVideo.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedVideo.collectModule.amount?.value,
      collectLimit: uploadedVideo.collectModule.collectLimit || '0'
    }
  })

  useEffect(() => {
    if (
      uploadedVideo.collectModule.isLimitedFeeCollect ||
      uploadedVideo.collectModule.isLimitedTimeFeeCollect
    ) {
      register('collectLimit')
    } else {
      unregister('collectLimit')
    }
  }, [uploadedVideo.collectModule, register, unregister])

  const getCurrencySymbol = (currencies: Erc20[], address: string) => {
    return currencies.find((c) => c.address === address)?.symbol as string
  }

  const onSubmit = (data: FormData) => {
    setCollectType({
      amount: {
        currency: data.currency,
        value: data.amount
      },
      referralFee: data.referralPercent,
      recipient: selectedChannel?.ownedBy,
      collectLimit: data.collectLimit
    })
    setShowModal(false)
  }

  const validateInputs = (data: FormData) => {
    const amount = Number(data.amount)
    const collectLimit = Number(data.collectLimit)
    if (amount === 0) {
      return setError('amount', { message: t`Amount should be greater than 0` })
    }
    if (collectLimit === 0) {
      return setError('collectLimit', {
        message: t`Collect limit should be greater than 0`
      })
    }
    if (splitRecipients.length > 5) {
      return toast.error(t`Only 5 splits supported`)
    }
    const splitsSum = splitRecipients.reduce(
      (total, obj) => obj.split + total,
      0
    )
    const invalidSplitAddresses = splitRecipients.filter(
      (splitRecipient) => !utils.isAddress(splitRecipient.recipient)
    )
    if (invalidSplitAddresses.length) {
      return toast.error(t`Invalid split recipient address`)
    }
    const uniqueValues = new Set(splitRecipients.map((v) => v.recipient))
    if (uniqueValues.size < splitRecipients.length) {
      return toast.error(t`Split addresses should be unique`)
    }
    if (
      uploadedVideo.collectModule.isMultiRecipientFeeCollect &&
      splitsSum !== 100
    ) {
      return toast.error(t`Sum of all splits should be 100%`)
    }
    data.collectLimit = String(collectLimit)
    data.amount = String(amount)
    onSubmit(data)
  }

  return (
    <form className="space-y-3">
      {uploadedVideo.collectModule.isLimitedFeeCollect ||
      uploadedVideo.collectModule.isLimitedTimeFeeCollect ? (
        <div>
          <Input
            label={t`Total Collectibles`}
            type="number"
            placeholder="3"
            min="1"
            autoComplete="off"
            validationError={errors.collectLimit?.message}
            {...register('collectLimit', {
              setValueAs: (v) => String(v)
            })}
          />
        </div>
      ) : null}
      <div>
        <div className="mb-1 flex items-center space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">
            <Trans>Collect Currency</Trans>
          </div>
        </div>
        <select
          autoComplete="off"
          className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900"
          {...register('currency')}
          value={uploadedVideo.collectModule.amount?.currency}
          onChange={(e) => {
            setCollectType({
              amount: { currency: e.target.value, value: '' }
            })
            setSelectedCurrencySymbol(
              getCurrencySymbol(
                enabledCurrencies.enabledModuleCurrencies,
                e.target.value
              )
            )
          }}
        >
          {enabledCurrencies?.enabledModuleCurrencies?.map(
            (currency: Erc20) => (
              <option key={currency.address} value={currency.address}>
                {currency.symbol}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <Input
          label={t`Price of each collect`}
          type="number"
          placeholder="1.5"
          min="0"
          autoComplete="off"
          max="100000"
          suffix={selectedCurrencySymbol}
          validationError={errors.amount?.message}
          {...register('amount', {
            setValueAs: (v) => String(v)
          })}
        />
      </div>
      <div>
        <Input
          label={t`Referral Percentage`}
          type="number"
          placeholder="2"
          suffix="%"
          info={t`Percent of collect revenue can be shared with anyone who mirrors this video.`}
          {...register('referralPercent', { valueAsNumber: true })}
          validationError={errors.referralPercent?.message}
        />
      </div>
      <Splits submitContainerRef={submitContainerRef} />
      <div className="flex justify-end pt-2" ref={submitContainerRef}>
        <Button type="button" onClick={() => handleSubmit(validateInputs)()}>
          <Trans>Set Collect Type</Trans>
        </Button>
      </div>
    </form>
  )
}

export default FeeCollectForm
