module.exports = {
	"env": {
		"node": true,
		"commonjs": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 6
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"eqeqeq": "error",
		"no-trailing-spaces": "error",
		"object-curly-spacing": [
			"error", "always"
		],
		"arrow-spacing": [
			"error", { "before": true, "after": true }
		],
		"no-console": 0,
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		]
	}
}
