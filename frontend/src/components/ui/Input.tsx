import './ui.css'

type InputProps = {
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <label className="ui-field">
      <span>{label}</span>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

export default Input