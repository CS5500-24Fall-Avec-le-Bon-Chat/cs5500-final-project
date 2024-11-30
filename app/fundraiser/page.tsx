import React from 'react'
import DonationDetails from '@/components/ui/DonationDetails'
import { TasksProvider } from '@/components/ui/TasksProvider'
import { DonorsProvider } from '@/components/ui/DonorProvider'

const page = () => {
  return (
    <div>
      <TasksProvider>
        <DonorsProvider>
          <DonationDetails />
        </DonorsProvider>
      </TasksProvider>
    </div>
  )
}
export default page