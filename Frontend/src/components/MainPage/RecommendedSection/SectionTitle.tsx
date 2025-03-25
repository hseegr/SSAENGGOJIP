type Props = {
  title: string
}

const SectionTitle = ({ title }: Props) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title} 추천 매물 🏠</h2>
    </div>
  )
}

export default SectionTitle
