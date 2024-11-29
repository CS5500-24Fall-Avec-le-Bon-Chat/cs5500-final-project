import React from 'react'
import DonationDetails from '@/components/ui/DonationDetails'
import { TasksProvider } from '@/components/ui/TasksProvider'

const page = () => {
  return (
    <div>
      <TasksProvider>
        <DonationDetails />
      </TasksProvider>
    </div>
  )
}
export default page