import { FolderX } from "lucide-react"

const NoNotes = () => {
  return (
    <div className="flex items-center flex-col gap-2">
        <FolderX className="mx-auto text-muted-foreground" size={48} />
        <h2 className="text-muted-foreground">No Notes Found!</h2>
    </div>
  )
}

export default NoNotes