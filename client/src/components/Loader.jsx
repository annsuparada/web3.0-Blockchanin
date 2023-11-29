const Loader = ({ message }) => (
  <div className="flex flex-col justify-center items-center py-3">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700" />
    <p className="text-gray-400">{message}</p>
  </div>
)

export default Loader
