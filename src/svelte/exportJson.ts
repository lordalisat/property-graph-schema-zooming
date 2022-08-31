export function download(json: string, fileName = 'schema.json') {
  const blob = new Blob([json], { type: 'application/json' });

  const file = new File([ blob ], fileName);

  const link = document.createElement('a')
  const url = URL.createObjectURL(file)

  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}