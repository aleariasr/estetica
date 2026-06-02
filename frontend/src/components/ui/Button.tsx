import './ui.css'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

function Button({ children, type = 'button' }: ButtonProps) {
  return (
    <button className="ui-button" type={type}>
      {children}
    </button>
  )
}

export default Button