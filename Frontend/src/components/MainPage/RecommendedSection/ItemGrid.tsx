import ItemCard from './ItemCard'

type Listing = {
  id: number
  name: string
  price: string
  area: number
  address: string
  floor: string
  latitude: number
  longitude: number
  mainImage: string | null
  dealType: string
  propertyType: string
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
