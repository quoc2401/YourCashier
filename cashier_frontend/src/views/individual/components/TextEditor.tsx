import { InputText } from "primereact/inputtext"
import { FC } from "react"

interface TextEditorProps {
    options: any
}

const TextEditor: FC<TextEditorProps> = ({options}) => {
    return (
      <InputText
        value={options.value}
        onChange={e => options.editorCallback(e.target.value)}
        className="w-full"
      />
    )
}

export default TextEditor