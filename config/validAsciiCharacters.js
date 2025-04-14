/**
 * @fileoverview This file defines a mapping of valid ASCII character codes
 * to their respective characters, based on the specification provided in
 * "Anexo G - Tabla de Caracteres Validos y Códigos ASCII Respectivos".
 *
 * This mapping is used to validate and process ASCII characters in the application.
 *
 * @lastModified 28 Marzo 2025
 */

/**
 * A mapping of ASCII character codes to their respective characters.
 *
 * @type {Object<number, string>}
 * @property {string} [32=" "] Space character
 * @property {string} [33="!"] Exclamation mark
 * @property {string} [34='"'] Double quote
 * @property {string} [35="#"] Hash symbol
 * @property {string} [36="$"] Dollar sign
 * @property {string} [37="%"] Percent sign
 * @property {string} [38="&"] Ampersand
 * @property {string} [39="'"] Single quote
 * @property {string} [40="("] Left parenthesis
 * @property {string} [41=")"] Right parenthesis
 * @property {string} [42="*"] Asterisk
 * @property {string} [43="+"] Plus sign
 * @property {string} [44=","] Comma
 * @property {string} [45="-"] Hyphen
 * @property {string} [46="."] Period
 * @property {string} [47="/"] Forward slash
 * @property {string} [48="0"] Digit 0
 * @property {string} [49="1"] Digit 1
 * @property {string} [50="2"] Digit 2
 * @property {string} [51="3"] Digit 3
 * @property {string} [52="4"] Digit 4
 * @property {string} [53="5"] Digit 5
 * @property {string} [54="6"] Digit 6
 * @property {string} [55="7"] Digit 7
 * @property {string} [56="8"] Digit 8
 * @property {string} [57="9"] Digit 9
 * @property {string} [58=":"] Colon
 * @property {string} [59=";"] Semicolon
 * @property {string} [63="?"] Question mark
 * @property {string} [64="@"] At symbol
 * @property {string} [65="A"] Uppercase A
 * @property {string} [66="B"] Uppercase B
 * @property {string} [67="C"] Uppercase C
 * @property {string} [68="D"] Uppercase D
 * @property {string} [69="E"] Uppercase E
 * @property {string} [70="F"] Uppercase F
 * @property {string} [71="G"] Uppercase G
 * @property {string} [72="H"] Uppercase H
 * @property {string} [73="I"] Uppercase I
 * @property {string} [74="J"] Uppercase J
 * @property {string} [75="K"] Uppercase K
 * @property {string} [76="L"] Uppercase L
 * @property {string} [77="M"] Uppercase M
 * @property {string} [78="N"] Uppercase N
 * @property {string} [79="O"] Uppercase O
 * @property {string} [80="P"] Uppercase P
 * @property {string} [81="Q"] Uppercase Q
 * @property {string} [82="R"] Uppercase R
 * @property {string} [83="S"] Uppercase S
 * @property {string} [84="T"] Uppercase T
 * @property {string} [85="U"] Uppercase U
 * @property {string} [86="V"] Uppercase V
 * @property {string} [87="W"] Uppercase W
 * @property {string} [88="X"] Uppercase X
 * @property {string} [89="Y"] Uppercase Y
 * @property {string} [90="Z"] Uppercase Z
 * @property {string} [92="\\"] Backslash
 * @property {string} [95="_"] Underscore
 * @property {string} [97="a"] Lowercase a
 * @property {string} [98="b"] Lowercase b
 * @property {string} [99="c"] Lowercase c
 * @property {string} [100="d"] Lowercase d
 * @property {string} [101="e"] Lowercase e
 * @property {string} [102="f"] Lowercase f
 * @property {string} [103="g"] Lowercase g
 * @property {string} [104="h"] Lowercase h
 * @property {string} [105="i"] Lowercase i
 * @property {string} [106="j"] Lowercase j
 * @property {string} [107="k"] Lowercase k
 * @property {string} [108="l"] Lowercase l
 * @property {string} [109="m"] Lowercase m
 * @property {string} [110="n"] Lowercase n
 * @property {string} [111="o"] Lowercase o
 * @property {string} [112="p"] Lowercase p
 * @property {string} [113="q"] Lowercase q
 * @property {string} [114="r"] Lowercase r
 * @property {string} [115="s"] Lowercase s
 * @property {string} [116="t"] Lowercase t
 * @property {string} [117="u"] Lowercase u
 * @property {string} [118="v"] Lowercase v
 * @property {string} [119="w"] Lowercase w
 * @property {string} [120="x"] Lowercase x
 * @property {string} [121="y"] Lowercase y
 * @property {string} [122="z"] Lowercase z
 * @property {string} [130="é"] Lowercase e with acute
 * @property {string} [160="á"] Lowercase a with acute
 * @property {string} [161="í"] Lowercase i with acute
 * @property {string} [162="ó"] Lowercase o with acute
 * @property {string} [163="ú"] Lowercase u with acute
 * @property {string} [164="ñ"] Lowercase n with tilde
 * @property {string} [165="Ñ"] Uppercase N with tilde
 * @property {string} [168="¿"] Inverted question mark
 * @property {string} [173="¡"] Inverted exclamation mark
 */
const validAsciiCharacters = {
  32: " ",
  33: "!",
  34: '"',
  35: "#",
  36: "$",
  37: "%",
  38: "&",
  39: "'",
  40: "(",
  41: ")",
  42: "*",
  43: "+",
  44: ",",
  45: "-",
  46: ".",
  47: "/",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  58: ":",
  59: ";",
  63: "?",
  64: "@",
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  92: "\\", // Single backslash, not double
  95: "_",
  97: "a",
  98: "b",
  99: "c",
  100: "d",
  101: "e",
  102: "f",
  103: "g",
  104: "h",
  105: "i",
  106: "j",
  107: "k",
  108: "l",
  109: "m",
  110: "n",
  111: "o",
  112: "p",
  113: "q",
  114: "r",
  115: "s",
  116: "t",
  117: "u",
  118: "v",
  119: "w",
  120: "x",
  121: "y",
  122: "z",
  130: "é",
  160: "á",
  161: "í",
  162: "ó",
  163: "ú",
  164: "ñ",
  165: "Ñ",
  168: "¿",
  173: "¡",
};

module.exports = validAsciiCharacters;
