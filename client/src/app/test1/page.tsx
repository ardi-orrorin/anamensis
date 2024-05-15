import FileUpload from "@/app/{commons}/{components}/block/file/fileUpload";
import FileBlock from "@/app/{commons}/{components}/block/file/fileBlock";

export default function Page () {
    return (
        <div>
            <FileBlock seq={1}
                       value={''}
                       code={'00007'}
            />
            <FileBlock seq={1}
                       value={'sdfsdf'}
                       code={'000012'}
            />
        </div>
    )
}