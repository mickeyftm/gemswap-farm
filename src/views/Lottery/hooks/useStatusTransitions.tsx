import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import usePreviousValue from 'hooks/usePreviousValue'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/hooks'
import { fetchPastLotteries, fetchCurrentLotteryId, fetchUserLotteries } from 'state/lottery'

const useStatusTransitions = () => {
  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status },
  } = useLottery()

  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const previousStatus = usePreviousValue(status)

  useEffect(() => {
    // Only run if there is a status state change
    if (previousStatus !== status) {
      // Current lottery transitions from CLOSE > CLAIMABLE
      if (previousStatus === LotteryStatus.CLOSE && status === LotteryStatus.CLAIMABLE) {
        dispatch(fetchPastLotteries())
        if (account) {
          dispatch(fetchUserLotteries({ account }))
        }
      }
      // Previous lottery to new lottery. From CLAIMABLE (previous round) > OPEN (new round)
      if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.OPEN) {
        dispatch(fetchPastLotteries())
        if (account) {
          dispatch(fetchUserLotteries({ account }))
        }
      }
    }
  }, [currentLotteryId, status, previousStatus, account, dispatch])

  useEffect(() => {
    // Current lottery is CLAIMABLE and the lottery is transitioning to a NEW round - fetch current lottery ID every 10s.
    // The isTransitioning condition will no longer be true when fetchCurrentLotteryId returns the next lottery ID
    if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.CLAIMABLE && isTransitioning) {
      dispatch(fetchCurrentLotteryId())
      dispatch(fetchPastLotteries())
      const interval = setInterval(async () => {
        dispatch(fetchCurrentLotteryId())
        dispatch(fetchPastLotteries())
      }, 10000)
      return () => clearInterval(interval)
    }
    return () => null
  }, [status, previousStatus, isTransitioning, dispatch])
}

export default useStatusTransitions
