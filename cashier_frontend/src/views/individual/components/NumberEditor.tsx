import { InputText } from "primereact/inputtext"
import { FC } from "react"

interface NumberEditorProps {
    options: any
    step?: number
}

const NumberEditor: FC<NumberEditorProps> = ({options, step = 1000}) => {
    return (
      <InputText
        type="number"
        value={options.value}
        step={step}
        onChange={e => options.editorCallback(e.target.value)}
        className="w-full"
      />
    )
}

export default NumberEditor