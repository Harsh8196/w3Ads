import ReportPublication from '@components/ReportPublication'
import Modal from '@components/UIElements/Modal'
import { t } from '@lingui/macro'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: Publication
  show: boolean
  setShowReport: React.Dispatch<boolean>
}

const ReportModal: FC<Props> = ({ show, setShowReport, video }) => {
  return (
    <Modal
      title={t`Report Publication`}
      onClose={() => setShowReport(false)}
      show={show}
      panelClassName="max-w-md"
    >
      <div className="mt-2">
        <ReportPublication
          publication={video}
          onSuccess={() => setShowReport(false)}
        />
      </div>
    </Modal>
  )
}

export default ReportModal
