import { Loader2 } from "lucide-react"

const LoadingScreen = ({ message } : { message: string}) => {
  return (
    <div className='flex flex-col items-center justify-center pt-10 mt-10'>
        <Loader2  className="text-primary animate-spin" size={30} />
        <h2>{message}</h2>
    </div>
  )
}

export default LoadingScreen