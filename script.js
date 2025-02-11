// made by matija
let editor

document.addEventListener("DOMContentLoaded", () => {
  initializeEditor()
  setupEventListeners()
  setupTooltips()
  setupMobileMenu()
})

function initializeEditor() {
  editor = ace.edit("editor")
  editor.setTheme("ace/theme/monokai")
  editor.session.setMode("ace/mode/javascript")
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    fontSize: "14px",
  })
}

function setupEventListeners() {
  const languageSelect = document.getElementById("language-select")
  languageSelect.addEventListener("change", function () {
    editor.session.setMode(`ace/mode/${this.value}`)
  })

  const checkCodeButton = document.getElementById("check-code")
  checkCodeButton.addEventListener("click", checkCode)

  const generateExampleButton = document.getElementById("generate-example")
  generateExampleButton.addEventListener("click", generateExample)
}

function setupTooltips() {
  const tooltips = document.querySelectorAll(".tooltip")
  tooltips.forEach((tooltip) => {
    const tooltipText = tooltip.getAttribute("data-tooltip")
    const span = document.createElement("span")
    span.className = "tooltiptext"
    span.textContent = tooltipText
    tooltip.appendChild(span)
  })
}

function setupMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })
}

function checkCode() {
  const code = editor.getValue()
  const language = document.getElementById("language-select").value
  const result = document.getElementById("result")

  result.innerHTML = '<p class="text-lg font-bold mb-2">Analyzing code...</p>'
  result.classList.add("animate-fadeIn")

  setTimeout(() => {
    const analysis = analyzeCode(code, language)
    displayResults(analysis)
  }, 1000)
}

function analyzeCode(code, language) {
  const analysis = {
    errors: [],
    warnings: [],
    suggestions: [],
  }

  switch (language) {
    case "javascript":
      if (code.includes("var ")) {
        analysis.warnings.push("Consider using 'let' or 'const' instead of 'var'.")
      }
      if (code.includes("==")) {
        analysis.warnings.push("Consider using '===' for strict equality comparison.")
      }
      if (!code.includes("use strict")) {
        analysis.suggestions.push("Consider adding 'use strict' at the beginning of your code.")
      }
      break
    case "html":
      if (!code.toLowerCase().includes("<!doctype html>")) {
        analysis.errors.push("Missing DOCTYPE declaration.")
      }
      if (!code.toLowerCase().includes("<html lang=")) {
        analysis.warnings.push("Consider adding a lang attribute to the <html> tag.")
      }
      break
    case "css":
      if (code.includes("!important")) {
        analysis.warnings.push("Avoid using '!important' as it can lead to specificity issues.")
      }
      break
    case "python":
      if (code.includes("print ")) {
        analysis.warnings.push("In Python 3, 'print' is a function. Use 'print()' instead.")
      }
      if (code.includes("xrange")) {
        analysis.errors.push("'xrange' is not available in Python 3. Use 'range' instead.")
      }
      break
    case "lua":
      if (code.includes("!=")) {
        analysis.errors.push("Use '~=' for inequality in Lua, not '!='.")
      }
      if (code.toLowerCase().includes("function") && !code.includes("end")) {
        analysis.errors.push("Function definition might be missing 'end' keyword.")
      }
      break
  }

  if (code.split("\n").some((line) => line.length > 100)) {
    analysis.warnings.push("Some lines are over 100 characters long. Consider breaking them for readability.")
  }

  const complexityScore = code.split("\n").length
  if (complexityScore > 50) {
    analysis.suggestions.push(
      `Your code is ${complexityScore} lines long. Consider breaking it into smaller functions or modules.`,
    )
  }

  return analysis
}

function displayResults(analysis) {
  const result = document.getElementById("result")
  let html = ""

  if (analysis.errors.length === 0 && analysis.warnings.length === 0 && analysis.suggestions.length === 0) {
    html = '<p class="text-green-400"><i class="fas fa-check-circle mr-2"></i>No issues found. Great job!</p>'
  } else {
    if (analysis.errors.length > 0) {
      html += '<h3 class="font-bold text-red-400 mb-2"><i class="fas fa-times-circle mr-2"></i>Errors:</h3>'
      html += '<ul class="list-disc pl-5 mb-4">'
      analysis.errors.forEach((error) => {
        html += `<li class="text-red-300">${error}</li>`
      })
      html += "</ul>"
    }
    if (analysis.warnings.length > 0) {
      html +=
        '<h3 class="font-bold text-yellow-400 mb-2"><i class="fas fa-exclamation-triangle mr-2"></i>Warnings:</h3>'
      html += '<ul class="list-disc pl-5 mb-4">'
      analysis.warnings.forEach((warning) => {
        html += `<li class="text-yellow-300">${warning}</li>`
      })
      html += "</ul>"
    }
    if (analysis.suggestions.length > 0) {
      html += '<h3 class="font-bold text-blue-400 mb-2"><i class="fas fa-lightbulb mr-2"></i>Suggestions:</h3>'
      html += '<ul class="list-disc pl-5 mb-4">'
      analysis.suggestions.forEach((suggestion) => {
        html += `<li class="text-blue-300">${suggestion}</li>`
      })
      html += "</ul>"
    }
  }

  result.innerHTML = html
  result.classList.add("animate-fadeIn")
}

function generateExample() {
  const language = document.getElementById("language-select").value
  let exampleCode = ""

  switch (language) {
    case "javascript":
      exampleCode = `// Example of a simple JavaScript function
function greet(name) {
    return \`Hello, \${name}! Welcome to Matija's CodePro.\`;
}

console.log(greet('Developer'));`
      break
    case "html":
      exampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matija's CodePro Example</title>
</head>
<body>
    <h1>Welcome to Matija's CodePro</h1>
    <p>This is a sample HTML page.</p>
</body>
</html>`
      break
    case "css":
      exampleCode = `/* Example CSS for a simple button */
.button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #45a049;
}`
      break
    case "python":
      exampleCode = `# Example of a Python class
class CodeChecker:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}! Welcome to Matija's CodePro."

checker = CodeChecker("Developer")
print(checker.greet())`
      break
    case "lua":
      exampleCode = `-- Example of a Lua function
function factorial(n)
    if n == 0 then
        return 1
    else
        return n * factorial(n - 1)
    end
end

print("Factorial of 5 is: " .. factorial(5))`
      break
  }

  editor.setValue(exampleCode)
  editor.clearSelection()
}

// made by matija

