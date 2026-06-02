type AppointmentFormProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

function AppointmentForm({
  title,
  subtitle,
  children,
}: AppointmentFormProps) {
  return (
    <>
      <div className="form-heading">
        <p>{subtitle}</p>
        <h2>{title}</h2>
      </div>

      <div className="appointment-form">
        {children}
      </div>
    </>
  )
}

export default AppointmentForm