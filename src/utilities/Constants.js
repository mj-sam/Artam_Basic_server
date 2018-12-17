export const MYSQL = {
  USERNAME: 'root',
  PASSWORD: '7',
  HOST:     'localhost',
  DATABASE: 'Crypto'
}

export const AUTH_TOKEN_EXPIRES = 2419200

export const USER_ROLE = [
  { role: 'user' },
  { role: 'operator' },
  { role: 'admin' },
]

export const SECRET_KEY = {
  REGISTER: 'RegisterSecretKey',
  PASSWORD: 'PasswordSecretKey',
  EMAIL:    'EmailSecretKey',
  PHONE:    'PhoneSecretKey',
  REFRRAL:  'RefrralnSecretKey',
}

export const SMS_PANEL = {
  URL:      'https://api.kavenegar.com/v1/5472304B4536794875594178687057783674654D78782B4234385879326C634E/sms/send.json ',
  API_KEY : '5472304B4536794875594178687057783674654D78782B4234385879326C634E',
}

export const EMAIL_PANEL = {
  HOST: 'smtp.gmail.com',
  PORT: 587,
  USER: 'irstartapp@gmail.com',
  PASSWORD: '251156F3NH1',
  FROM: '"Start App" <irstartapp@gmail.com>'
}
