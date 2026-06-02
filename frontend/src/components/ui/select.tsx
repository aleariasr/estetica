import './ui.css'

type SelectOption = {
  value: string | number
  label: string
}

type SelectProps = {
  label: string
  value: string
  options: SelectOption[]
  placeholder?: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function Select({
  label,
  value,
  options,
  placeholder = 'Seleccione una opción',
  onChange,
}: SelectProps) {
  return (
    <label className="ui-field">
      <span>{label}</span>

      <select value={value} onChange={onChange}>
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Select