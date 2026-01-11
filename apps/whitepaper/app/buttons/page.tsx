import { ActionButton } from '@/components/action-button'
import { FavoriteButton } from '@/components/favorite-button'
import { RefreshButton } from '@/components/refresh-button'
export default function ButtonsPage() {
  return (
    <div className='flex flex-row justify-center gap-4 items-center'>
      <ActionButton />
      <FavoriteButton />
      <RefreshButton />
    </div>
  )
}
