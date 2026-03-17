type Message = unknown

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
}

const time = () => new Date().toISOString()

export const print = {
  result(message: Message) {
    console.log(`${colors.gray}${message}${colors.reset}`)
  },

  info(message: Message) {
    console.log(`${colors.blue}[INFO]${colors.reset} ${time()} ->`, message)
  },

  warn(message: Message) {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${time()} ->`, message)
  },

  error(message: Message) {
    console.error(`${colors.red}[ERROR]${colors.reset} ${time()} ->`, message)
  },
}