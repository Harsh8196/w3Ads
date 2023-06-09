import type { WebBundlr } from '@bundlr-network/client'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import RefreshOutline from '@components/Common/Icons/RefreshOutline'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import { utils } from 'ethers'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  BUNDLR_CONNECT_MESSAGE,
  BUNDLR_CURRENCY,
  POLYGON_CHAIN_ID,
  TRACK
} from 'utils'
import useIsMounted from 'utils/hooks/useIsMounted'
import logger from 'utils/logger'
import { useAccount, useBalance, useSigner } from 'wagmi'

const BundlrInfo = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const setBundlrData = useAppStore((state) => state.setBundlrData)

  const { mounted } = useIsMounted()
  const { data: userBalance } = useBalance({
    address,
    chainId: POLYGON_CHAIN_ID,
    watch: true
  })

  const estimatePrice = async (bundlr: WebBundlr) => {
    if (!uploadedVideo.stream) {
      return toast.error(t`Upload cost estimation failed`)
    }
    return await bundlr.utils.getPrice(
      BUNDLR_CURRENCY,
      uploadedVideo.stream?.size
    )
  }

  const fetchBalance = async (bundlr?: WebBundlr) => {
    try {
      const instance = bundlr || bundlrData.instance
      if (address && instance) {
        const balance = await instance.getBalance(address)
        const price = await estimatePrice(instance)
        setBundlrData({
          balance: utils.formatEther(balance.toString()),
          estimatedPrice: utils.formatEther(price.toString())
        })
      }
    } catch (error) {
      logger.error('[Error Fetch Bundlr Balance]', error)
    }
  }

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast.loading(BUNDLR_CONNECT_MESSAGE)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
        await fetchBalance(bundlr)
      }
    }
  }

  useEffect(() => {
    if (signer?.provider && mounted) {
      initBundlr().catch((error) => logger.error('[Error Init Bundlr]', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer?.provider, mounted])

  useEffect(() => {
    if (bundlrData.instance && mounted) {
      fetchBalance(bundlrData.instance).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundlrData.instance])

  const depositToBundlr = async () => {
    if (!bundlrData.instance) {
      return await initBundlr()
    }
    if (!bundlrData.deposit) {
      return toast.error(t`Enter deposit amount`)
    }
    const depositAmount = parseFloat(bundlrData.deposit)
    const value = utils.parseUnits(depositAmount.toString())._hex
    if (!value || Number(value) < 1) {
      return toast.error(t`Invalid deposit amount`)
    }
    if (
      userBalance?.formatted &&
      parseFloat(userBalance?.formatted) < depositAmount
    ) {
      return toast.error(
        `Insufficient funds in your wallet, you have ${userBalance?.formatted} MATIC.`
      )
    }
    setBundlrData({ depositing: true })
    try {
      const fundResult = await bundlrData.instance.fund(value)
      if (fundResult) {
        toast.success(
          `Deposit of ${utils.formatEther(
            fundResult?.quantity
          )} is done and it will be reflected in few seconds.`
        )
        Analytics.track(TRACK.DEPOSIT_MATIC)
      }
    } catch (error) {
      toast.error(t`Failed to deposit storage balance`)
      logger.error('[Error Bundlr Deposit]', error)
    } finally {
      await fetchBalance()
      setBundlrData({
        deposit: null,
        showDeposit: false,
        depositing: false
      })
    }
  }

  const onRefreshBalance = async () => {
    if (!bundlrData.instance) {
      return await initBundlr()
    }
    await fetchBalance()
  }

  return (
    <div className="mt-4 w-full space-y-2">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between rounded text-sm font-medium opacity-80">
          <span className="flex items-center space-x-1.5">
            <span>
              <Trans>Your Storage Balance</Trans>
            </span>
            <Tooltip content="Refresh balance" placement="top">
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => onRefreshBalance()}
              >
                <RefreshOutline className="h-3 w-3" />
              </button>
            </Tooltip>
          </span>
          <span>
            <button
              type="button"
              onClick={() =>
                setBundlrData({
                  showDeposit: !bundlrData.showDeposit
                })
              }
              className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 focus:outline-none dark:bg-gray-900"
            >
              <span className="px-0.5 text-xs">
                <Trans>Deposit</Trans>
              </span>
              {bundlrData.showDeposit ? (
                <ChevronUpOutline className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDownOutline className="ml-1 h-3 w-3" />
              )}
            </button>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium">{bundlrData.balance}</span>
        </div>
      </div>
      {bundlrData.showDeposit && (
        <div>
          <div className="mb-2 inline-flex flex-col text-sm font-medium opacity-80">
            <Trans>Amount to deposit (MATIC)</Trans>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder={userBalance?.formatted}
              className="py-1.5 md:py-2"
              autoComplete="off"
              min={0}
              value={bundlrData.deposit || ''}
              onChange={(e) => {
                setBundlrData({ deposit: e.target.value })
              }}
            />
            <Button
              type="button"
              size="md"
              loading={bundlrData.depositing}
              onClick={() => depositToBundlr()}
            >
              <Trans>Deposit</Trans>
            </Button>
          </div>
        </div>
      )}
      <div>
        <span className="inline-flex flex-col text-sm font-medium opacity-80">
          <Trans>Estimated Cost to Upload</Trans>
        </span>
        <div className="text-lg font-medium">{bundlrData.estimatedPrice}</div>
      </div>
    </div>
  )
}

export default BundlrInfo
