import { useState, useEffect } from 'react'

/**
 * Input numérico que permite edición libre (borrar, escribir parcialmente)
 * sin corregir el valor hasta que el usuario termina (onBlur).
 */
export default function NumInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  className = 'form-input',
  placeholder = '',
  style,
}) {
  const [display, setDisplay] = useState(value === '' ? '' : String(value))

  useEffect(() => {
    // Solo sincroniza si el valor externo es diferente al parseado del display
    const parsed = parseFloat(display)
    if (isNaN(parsed) || parsed !== value) {
      setDisplay(value === '' ? '' : String(value))
    }
  }, [value])

  const normalize = (raw) => raw.replace(',', '.')

  const handleChange = (e) => {
    const raw = e.target.value
    setDisplay(raw)
    const parsed = parseFloat(normalize(raw))
    if (!isNaN(parsed) && normalize(raw).trim() !== '') {
      const clamped = clamp(parsed, min, max)
      onChange(clamped)
    }
  }

  const handleBlur = () => {
    const parsed = parseFloat(normalize(display))
    if (isNaN(parsed) || display.trim() === '') {
      setDisplay(String(value))
    } else {
      const clamped = clamp(parsed, min, max)
      onChange(clamped)
      setDisplay(String(clamped))
    }
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      className={className}
      value={display}
      placeholder={placeholder}
      style={style}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}

function clamp(val, min, max) {
  if (min !== undefined && val < min) return min
  if (max !== undefined && val > max) return max
  return val
}
