# Node Editor & IDE Component Comparison

This project allows you to test and compare three popular packages for building node-based editors and code editors in Vue.js:

1. **Baklava.js** - Node-based visual programming framework
2. **Vue Flow** - Highly customizable flow and diagram builder
3. **Monaco Editor** - The code editor that powers VS Code

## 🚀 Quick Start

The development server is running at **http://localhost:5173/**

If you need to restart it:
```powershell
cd "C:\Users\Jervis\Documents\MLOps\node-editor-test"
npm run dev
```

## 📁 Project Structure

```
node-editor-test/
├── src/
│   ├── views/
│   │   ├── HomeView.vue         # Home page with comparison
│   │   ├── BaklavaDemo.vue      # Baklava.js demo
│   │   ├── VueFlowDemo.vue      # Vue Flow demo
│   │   └── MonacoDemo.vue       # Monaco Editor demo
│   ├── router/
│   │   └── index.ts             # Vue Router configuration
│   └── App.vue                  # Main app component
├── package.json
└── vite.config.ts
```

## 🎯 Features Included

### Baklava.js Demo
- Code examples and architecture overview
- Sample node types (Math nodes, Input nodes, Display nodes)
- Use cases and implementation patterns

### Vue Flow Demo
- Interactive node editor with drag & drop
- Multiple node types (input, default, output)
- Animated connections
- Background grid
- Zoom and pan controls
- Node selection and events

### Monaco Editor Demo
- Full code editor with syntax highlighting
- Multiple language support (JavaScript, TypeScript, Python, HTML, CSS, JSON)
- Theme switching (Light, Dark, High Contrast)
- Code execution for JavaScript
- IntelliSense and code completion
- Find and replace
- Multi-cursor editing

## 📦 Installed Packages

```json
{
  "@baklavajs/core": "^2.x",
  "@baklavajs/renderer-vue": "^2.x",
  "@vue-flow/core": "^1.x",
  "@vue-flow/background": "^1.x",
  "@vue-flow/controls": "^1.x",
  "monaco-editor": "^0.x"
}
```

## 🔧 Development Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

## 📊 Comparison Summary

| Feature | Baklava.js | Vue Flow | Monaco Editor |
|---------|------------|----------|---------------|
| Use Case | Logic flows, node graphs | Workflows, diagrams | Code editing |
| Vue 3 Native | ✅ Yes | ✅ Yes | ⚠️ Wrapper needed |
| Customization | High (plugins) | High (components) | Medium |
| Learning Curve | Medium | Low | Low-Medium |
| Bundle Size | Small | Medium | Large |

## 🎨 Which One Should You Choose?

### Choose **Baklava.js** if:
- You need a plugin-based architecture
- Building visual programming tools
- Need custom calculation flows
- Want extensible node types

### Choose **Vue Flow** if:
- You need quick setup with Vue 3
- Building workflow or diagram tools
- Need drag-and-drop functionality
- Want reactive, composable components

### Choose **Monaco Editor** if:
- You need a code editor
- Want VS Code-like experience
- Need IntelliSense and autocomplete
- Supporting multiple programming languages

## 🌐 Navigation

The app has a navigation bar at the top with links to:
- **Home** - Overview and comparison
- **Baklava.js** - Baklava.js demo and documentation
- **Vue Flow** - Interactive Vue Flow demo
- **Monaco Editor** - Code editor with live JavaScript execution

## 📝 Notes

- The project uses Vue 3 with TypeScript
- Vite is used as the build tool for fast development
- Vue Router handles navigation between demos
- All demos are self-contained in their respective view components

## 🔗 Useful Resources

- [Baklava.js Documentation](https://baklavajs.github.io/)
- [Vue Flow Documentation](https://vueflow.dev/)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)

## 💡 Next Steps

1. Test each demo by clicking through the navigation
2. Experiment with the interactive features
3. Review the source code in `src/views/` to see implementation details
4. Try modifying the demos to fit your specific use case
5. Check bundle sizes with `npm run build` to compare final output

Happy coding! 🚀
