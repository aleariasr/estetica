import './ui.css'

type TextareaProps = {
  label: string
  value: string
  placeholder?: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function Textarea({
  label,
  value,
  placeholder,
  onChange,
}: TextareaProps) {
  return (
    <label className="ui-field">
      <span>{label}</span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  )
}

export default Textarea