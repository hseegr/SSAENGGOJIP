import ItemCard from './ItemCard'

type Listing = {
  id: number
  type: string
  price: string
  floor: string
  address: string
  station: string
  imageUrl?: string
}

type Props = {
  listings: Listing[]
}

const ItemGrid = ({ listings }: Props) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {listings.map((item) => (
        <ItemCard key={item.id} listing={item} />
      ))}
    </div>
  )
}

export default ItemGrid
