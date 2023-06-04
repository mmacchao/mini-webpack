const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')
const ejs = require('ejs')

const fs = require('fs')
const path = require('path')
let id = 1
let globalConfig = {}
function createAsset(filename) {
    let source = fs.readFileSync(filename, { encoding: 'utf-8' })

    // 将非js转换成js
    const rules = globalConfig.module.rules
    rules.forEach(({test, use} ) => {
        if(test.test(filename)) {
            source = use(source)
        }
    })

    let ast = parser.parse(source, { sourceType: 'module' })

    const deps = []
    traverse(ast, {
        // 获取文件依赖
        ImportDeclaration: ({ node }) => {
            deps.push(node.source.value)
            // console.log(node.source.value)
        }
    })

    // es6 -> es5
    const { code } = transformFromAst(ast, null, { presets: ['@babel/preset-env'] })

    return {
        id: id++,
        code,
        deps,
        filename,
        mapping: {
        }
    }
}

function createGraph() {
    const mainAsset = createAsset(globalConfig.entry)
    // console.log(mainAsset)
    const queue = [mainAsset]
    for (const asset of queue) {
        asset.deps.forEach(dep => {
            const subAsset = createAsset(path.resolve('./example', dep))
            asset.mapping[dep] = subAsset.id
            queue.push(subAsset)
        })
    }
    return queue
    // console.log(queue)
}

// createAsset('./example/main.js')

function bundle(graph) {

    function createModules(graph) {
        const modules = {

        }
        graph.forEach((asset, i) => {
            modules[asset.id] = asset
        })
        return modules
    }

    const modules = createModules(graph)
    // console.log(modules)
    const bundleTemplate = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' })
    const code = ejs.render(bundleTemplate, {
        modules
    })
    function emitFile(context) {
        fs.writeFileSync('./example/dist/bundle.js', context)
    }
    emitFile(code)
}

function webpack(webpackConfig) {
    globalConfig = webpackConfig
    const graph = createGraph()
    bundle(graph)
}


function mdLoader(source) {
    // 这里处理
    console.log(source)

    return `export default "this is a md"`
}

const webpackConfig = {
    entry: './example/main.js',
    module: {
        rules: [
            { test: /.md$/, use: mdLoader }
        ]
    }
}
webpack(webpackConfig)