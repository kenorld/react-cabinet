import get from 'lodash.get'
import set from 'lodash.set'

export function getValues(record, source) {
  const fields = source.split(','), values = []
  fields.forEach((field) => {
    field = field.trim()
    values.push(get(record, field))
  })
  return values
}

export function collectProps(originalProps, definedProps) {
  const props = {}
  for (let key in definedProps) {
    if (originalProps[key] !== undefined) {
      props[key] = originalProps[key]
    }
  }
  return props
}

export function fetchValue(element, defaultValue = "") {
  const value = get(element.record||element.props.record, element.props.source)
  return value === undefined ? defaultValue : value
}

export function writeValue(element, value) {
  set(element.record, element.props.source, value)
}